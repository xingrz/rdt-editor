import { parse } from 'qs';
import { split } from '@/utils/split';

export type RDTNode = {
  kind: string;
  offset: number;
  length: number;
};

export type RDTMap = {
  rows: (RDTRow | RDTCollapsible)[];
};

export type RDTCollapsible = RDTNode & {
  kind: 'collapsible';
  rows: RDTRow[];
};

export type RDTRow = RDTNode & {
  kind: 'row';
  src: string;
  lInfo: RDTInfo[];
  rInfo: RDTInfo[];
  cells: RDTCell[];
  params?: Record<string, string>;
};

export type RDTCell = RDTNode & {
  kind: 'cell';
  src: string;
  icons: (RDTIcon | RDTText)[];
  link?: string;
  params?: Record<string, string>;
};

export type RDTIcon = RDTNode & {
  kind: 'icon';
  name: string;
  params?: Record<string, string>;
};

export type RDTText = RDTNode & {
  kind: 'text';
  text: string;
  prefix?: string;
  params?: Record<string, string>;
};

export type RDTInfo = RDTNode & {
  kind: 'info';
  text: string;
  column: number;
};

export function parseMap(src: string): RDTMap {
  const rows = parseRows(src);
  // TODO: support collapsible rows
  return { rows };
}

export function parseRows(src: string): RDTRow[] {
  return split(src, /\r?\n/)
    .map(({ part, offset }) =>
      parseRow(part, offset)
    );
}

export function parseRow(src: string, offset: number): RDTRow {
  const [, lInfo = '', cells = '', rInfo = ''] = src.match(/^(.*! !)?(.*?)(~~.*)?$/) ?? [];

  const lInfoItems = parseInfos(lInfo.slice(0, -3), offset, 'L');
  const rInfoItems = parseInfos(rInfo.slice(2), offset + lInfo.length + cells.length + 2, 'R');

  const params = parseParams(rInfoItems[4]?.text);

  return {
    kind: 'row',
    offset,
    length: src.length,
    src,
    lInfo: lInfoItems.slice(0, 4),
    rInfo: rInfoItems.slice(0, 4),
    cells: parseCells(cells, offset + lInfo.length),
    params,
  };
}

export function parseInfos(src: string, offset: number, placement: 'L' | 'R'): RDTInfo[] {
  if (!src) return [];

  return ((parts) => placement == 'L' ? parts.reverse() : parts)(split(src, '~~'))
    .map(({ part, offset: partOffset }, index, parts) =>
      parseInfo(part, offset + partOffset, index, parts.length)
    );
}

export function parseInfo(src: string, offset: number, index: number, total: number): RDTInfo {
  const column = total == 1
    ? 2
    : index + 1;

  return {
    kind: 'info',
    offset,
    length: src.length,
    text: src.trim(),
    column,
  };
}

export function parseCells(src: string, offset: number): RDTCell[] {
  return split(src, '\\')
    .map(({ part, offset: partOffset }) =>
      parseCell(part, offset + partOffset)
    );
}

export function parseCell(src: string, offset: number): RDTCell {
  const [, name = '', link, params] = src.match(/^(.*?)(?:!@(.+?))?(?:!_(.+?))?$/) ?? [];

  return {
    kind: 'cell',
    src,
    offset,
    length: src.length,
    icons: parseIcons(name, offset),
    link,
    params: parseParams(params),
  };
}

export function parseIcons(src: string, offset: number): (RDTIcon | RDTText)[] {
  return split(src, '!~')
    .map(({ part, offset: partOffset }) =>
      part.includes('*')
        ? parseText(part, offset + partOffset)
        : parseIcon(part, offset + partOffset)
    );
}

export function parseIcon(src: string, offset: number): RDTIcon {
  const [, name = '', params] = src.match(/^(.*?)(?:__(.+))?$/) ?? [];

  return {
    kind: 'icon',
    offset,
    length: src.length,
    name,
    params: parseParams(params),
  };
}

export function parseText(src: string, offset: number): RDTText {
  const [, prefix, text = '', params] = src.match(/^(.*?)\*(.*?)(?:__(.+))?$/) ?? [];

  return {
    kind: 'text',
    offset,
    length: src.length,
    text,
    prefix,
    params: parseParams(params),
  };
}

export function parseParams(src: string | undefined): Record<string, string> | undefined {
  if (!src) return undefined;
  return parse(src, { delimiter: ',' }) as Record<string, string>;
}
