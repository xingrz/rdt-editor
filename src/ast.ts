import { parse } from 'qs';
import { split } from '@/utils/split';

export type RDTNode = {
  kind: string;
  offset: number;
  length: number;
};

export type RDTMap = {
  rows: (RDTRow | RDTKeyword)[];
};

export type RDTKeyword = RDTNode & {
  kind: 'keyword';
  src: string;
  func: string;
  args: string[];
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
  prefix: string;
  params?: Record<string, string>;
};

export type RDTInfo = RDTNode & {
  kind: 'info';
  text: string;
  column: number;
};

export type ParseMapOptions = {
  parseRows?: typeof parseRows;
};

export function parseMap(src: string, opts?: ParseMapOptions): RDTMap {
  const rows = (opts?.parseRows ?? parseRows)(src);
  return { rows };
}

export type ParseRowsOptions = {
  parseRow?: typeof parseRow;
  parseKeyword?: typeof parseKeyword;
};

export function parseRows(src: string, opts?: ParseRowsOptions): (RDTRow | RDTKeyword)[] {
  return split(src, /\r?\n/)
    .map(({ part, offset }) =>
      part.startsWith('-')
        ? (opts?.parseKeyword ?? parseKeyword)(part, offset)
        : (opts?.parseRow ?? parseRow)(part, offset)
    );
}

export function parseKeyword(src: string, offset: number): RDTKeyword {
  const [, func = '', ...args] = src.split('-');
  return {
    kind: 'keyword',
    offset,
    length: src.length,
    src,
    func,
    args,
  };
}

export type ParseRowOptions = {
  parseLInfos?: typeof parseInfos;
  parseRInfos?: typeof parseInfos;
  parseCells?: typeof parseCells;
  parseParams?: typeof parseParams;
};

export function parseRow(src: string, offset: number, opts?: ParseRowOptions): RDTRow {
  const [, lInfo = '', lSplitter = '', cells = '', rSplitter = '', rInfo = ''] =
    src.match(/^(?:(.*)(! !))?(.*?)(?:(~~)(.*))?$/) ?? [];

  const lInfoItems = (opts?.parseLInfos ?? parseInfos)(lInfo, offset, 'L');
  const rInfoItems = (opts?.parseRInfos ?? parseInfos)(rInfo, offset + lInfo.length + lSplitter.length + cells.length + rSplitter.length, 'R');

  const params = (opts?.parseParams ?? parseParams)(rInfoItems[4]?.text);

  return {
    kind: 'row',
    offset,
    length: src.length,
    src,
    lInfo: lInfoItems.slice(0, 4),
    rInfo: rInfoItems.slice(0, 4),
    cells: (opts?.parseCells ?? parseCells)(cells, offset + lInfo.length + lSplitter.length),
    params,
  };
}

export type ParseInfosOptions = {
  parseInfo?: typeof parseInfo;
};

export function parseInfos(src: string, offset: number, placement: 'L' | 'R', opts?: ParseInfosOptions): RDTInfo[] {
  if (!src) return [];

  return ((parts) => placement == 'L' ? parts.reverse() : parts)(split(src, '~~'))
    .map(({ part, offset: partOffset }, index, parts) =>
      (opts?.parseInfo ?? parseInfo)(part, offset + partOffset, index, parts.length)
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

export type ParseCellsOptions = {
  parseCell?: typeof parseCell;
};

export function parseCells(src: string, offset: number, opts?: ParseCellsOptions): RDTCell[] {
  return split(src, '\\')
    .map(({ part, offset: partOffset }) =>
      (opts?.parseCell ?? parseCell)(part, offset + partOffset)
    );
}

export type ParseCellOptions = {
  parseIcons?: typeof parseIcons;
  parseParams?: typeof parseParams;
};

export function parseCell(src: string, offset: number, opts?: ParseCellOptions): RDTCell {
  const [, icons = '', link, params] = src.match(/^(.*?)(?:!@(.+?))?(?:!_(.+?))?$/) ?? [];

  return {
    kind: 'cell',
    src,
    offset,
    length: src.length,
    icons: (opts?.parseIcons ?? parseIcons)(icons, offset),
    link,
    params: (opts?.parseParams ?? parseParams)(params),
  };
}

export type ParseIconsOptions = {
  parseIcon?: typeof parseIcon;
  parseText?: typeof parseText;
};

export function parseIcons(src: string, offset: number, opts?: ParseIconsOptions): (RDTIcon | RDTText)[] {
  return split(src, '!~')
    .map(({ part, offset: partOffset }) =>
      part.includes('*')
        ? (opts?.parseText ?? parseText)(part, offset + partOffset)
        : (opts?.parseIcon ?? parseIcon)(part, offset + partOffset)
    );
}

export type ParseIconOptions = {
  parseParams?: typeof parseParams;
};

export function parseIcon(src: string, offset: number, opts?: ParseIconOptions): RDTIcon {
  const [, name = '', params] = src.match(/^(.*?)(?:__(.+))?$/) ?? [];

  return {
    kind: 'icon',
    offset,
    length: src.length,
    name,
    params: (opts?.parseParams ?? parseParams)(params),
  };
}

export type ParseTextOptions = {
  parseParams?: typeof parseParams;
};

export function parseText(src: string, offset: number, opts?: ParseTextOptions): RDTText {
  const [, prefix = '', text = '', params] = src.match(/^(.*?)\*(.*?)(?:__(.+))?$/) ?? [];

  return {
    kind: 'text',
    offset,
    length: src.length,
    text,
    prefix,
    params: (opts?.parseParams ?? parseParams)(params),
  };
}

export function parseParams(src: string | undefined): Record<string, string> | undefined {
  if (!src) return undefined;
  return parse(src, { delimiter: ',' }) as Record<string, string>;
}
