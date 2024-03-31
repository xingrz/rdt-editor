export default function splitWithOffset(str: string, splitter: string, initialOffset = 0) {
  let offset = initialOffset;
  return str.split(splitter).map((part) => {
    const o = offset;
    offset += part.length + splitter.length;
    return { part, offset: o };
  });
}
