export type SplitResult = {
  offset: number;
  part: string;
  tail?: string;
}[];

export function split(src: string, splitter: string | RegExp): SplitResult {
  const parts: { part: string; offset: number; tail?: string }[] = [];
  const match = typeof splitter == 'string'
    ? (src: string) => nextString(src, splitter)
    : (src: string) => nextRegex(src, splitter);

  let next: Next | null;
  let offset = 0;
  while ((next = match(src.slice(offset)))) {
    parts.push({ part: src.slice(offset, offset + next.index), offset, tail: next.match });
    offset += next.index + next.match.length;
  }
  parts.push({ part: src.slice(offset), offset });

  return parts;
}

type Next = { match: string, index: number };

function nextString(src: string, what: string): Next | null {
  const index = src.indexOf(what);
  if (index < 0) return null;
  return { match: what, index };
}

function nextRegex(src: string, what: RegExp): Next | null {
  const match = src.match(what);
  if (!match || match.index === undefined) return null;
  return { match: match[0], index: match.index };
}
