import { expect, test, vi } from 'vitest';
import { parseCells } from '@/ast';

test('single cell', () => {
  const parseCell = vi.fn().mockReturnValue({
    kind: 'cell',
    src: 'mock-src',
    offset: 100,
    length: 111,
    icons: [{ kind: 'icon', offset: 200, length: 222, name: 'mock-icon' }],
    link: undefined,
    params: undefined,
  });

  expect(parseCells('STR', 0, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'mock-src',
      offset: 100,
      length: 111,
      icons: [{ kind: 'icon', offset: 200, length: 222, name: 'mock-icon' }],
      link: undefined,
      params: undefined,
    },
  ]);

  expect(parseCell).toHaveBeenCalledOnce();
  expect(parseCell).toHaveBeenCalledWith('STR', 0);
});

test('multiple cells', () => {
  const parseCell = vi.fn()
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'first-cell',
      offset: 1000,
      length: 1111,
      icons: [{ kind: 'icon', offset: 1200, length: 1222, name: 'first-icon' }],
      link: 'first-link',
      params: { first: 'param' },
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'second-cell',
      offset: 2000,
      length: 2222,
      icons: [{ kind: 'text', offset: 2200, length: 2333, text: 'second-text', prefix: 'sp' }],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'third-cell',
      offset: 3000,
      length: 3333,
      icons: [],
      link: undefined,
      params: { third: 'param' },
    });

  expect(parseCells('STR\\DEX\\VIT', 10, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'first-cell',
      offset: 1000,
      length: 1111,
      icons: [{ kind: 'icon', offset: 1200, length: 1222, name: 'first-icon' }],
      link: 'first-link',
      params: { first: 'param' },
    },
    {
      kind: 'cell',
      src: 'second-cell',
      offset: 2000,
      length: 2222,
      icons: [{ kind: 'text', offset: 2200, length: 2333, text: 'second-text', prefix: 'sp' }],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'third-cell',
      offset: 3000,
      length: 3333,
      icons: [],
      link: undefined,
      params: { third: 'param' },
    },
  ]);

  expect(parseCell).toHaveBeenCalledTimes(3);
  expect(parseCell).toHaveBeenNthCalledWith(1, 'STR', 10);
  expect(parseCell).toHaveBeenNthCalledWith(2, 'DEX', 14);
  expect(parseCell).toHaveBeenNthCalledWith(3, 'VIT', 18);
});

test('empty cells', () => {
  const parseCell = vi.fn()
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'empty1',
      offset: 4000,
      length: 4444,
      icons: [],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'empty2',
      offset: 5000,
      length: 5555,
      icons: [],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'empty3',
      offset: 6000,
      length: 6666,
      icons: [],
      link: undefined,
      params: undefined,
    });

  expect(parseCells('\\\\', 0, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'empty1',
      offset: 4000,
      length: 4444,
      icons: [],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'empty2',
      offset: 5000,
      length: 5555,
      icons: [],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'empty3',
      offset: 6000,
      length: 6666,
      icons: [],
      link: undefined,
      params: undefined,
    },
  ]);

  expect(parseCell).toHaveBeenCalledTimes(3);
  expect(parseCell).toHaveBeenNthCalledWith(1, '', 0);
  expect(parseCell).toHaveBeenNthCalledWith(2, '', 1);
  expect(parseCell).toHaveBeenNthCalledWith(3, '', 2);
});

test('empty string', () => {
  const parseCell = vi.fn().mockReturnValue({
    kind: 'cell',
    src: 'single-empty',
    offset: 7000,
    length: 7777,
    icons: [],
    link: undefined,
    params: undefined,
  });

  expect(parseCells('', 50, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'single-empty',
      offset: 7000,
      length: 7777,
      icons: [],
      link: undefined,
      params: undefined,
    },
  ]);

  expect(parseCell).toHaveBeenCalledOnce();
  expect(parseCell).toHaveBeenCalledWith('', 50);
});

test('mixed empty and content cells', () => {
  const parseCell = vi.fn()
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'content-cell',
      offset: 8000,
      length: 8888,
      icons: [{ kind: 'icon', offset: 8100, length: 8111, name: 'content-icon' }],
      link: 'content-link',
      params: { content: 'param' },
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'empty-cell',
      offset: 9000,
      length: 9999,
      icons: [],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'another-cell',
      offset: 1010,
      length: 1212,
      icons: [{ kind: 'text', offset: 1100, length: 1122, text: 'another-text', prefix: 'ap' }],
      link: undefined,
      params: undefined,
    });

  expect(parseCells('STR!@link!_content=param\\\\VIT', 20, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'content-cell',
      offset: 8000,
      length: 8888,
      icons: [{ kind: 'icon', offset: 8100, length: 8111, name: 'content-icon' }],
      link: 'content-link',
      params: { content: 'param' },
    },
    {
      kind: 'cell',
      src: 'empty-cell',
      offset: 9000,
      length: 9999,
      icons: [],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'another-cell',
      offset: 1010,
      length: 1212,
      icons: [{ kind: 'text', offset: 1100, length: 1122, text: 'another-text', prefix: 'ap' }],
      link: undefined,
      params: undefined,
    },
  ]);

  expect(parseCell).toHaveBeenCalledTimes(3);
  expect(parseCell).toHaveBeenNthCalledWith(1, 'STR!@link!_content=param', 20);
  expect(parseCell).toHaveBeenNthCalledWith(2, '', 45);
  expect(parseCell).toHaveBeenNthCalledWith(3, 'VIT', 46);
});

test('with complex offset calculation', () => {
  const parseCell = vi.fn()
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'offset1',
      offset: 2000,
      length: 2111,
      icons: [{ kind: 'icon', offset: 2200, length: 2222, name: 'offset-icon1' }],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'offset2',
      offset: 3000,
      length: 3333,
      icons: [{ kind: 'icon', offset: 3200, length: 3222, name: 'offset-icon2' }],
      link: undefined,
      params: undefined,
    });

  expect(parseCells('ABC\\XYZ', 100, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'offset1',
      offset: 2000,
      length: 2111,
      icons: [{ kind: 'icon', offset: 2200, length: 2222, name: 'offset-icon1' }],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'offset2',
      offset: 3000,
      length: 3333,
      icons: [{ kind: 'icon', offset: 3200, length: 3222, name: 'offset-icon2' }],
      link: undefined,
      params: undefined,
    },
  ]);

  expect(parseCell).toHaveBeenCalledTimes(2);
  expect(parseCell).toHaveBeenNthCalledWith(1, 'ABC', 100);
  expect(parseCell).toHaveBeenNthCalledWith(2, 'XYZ', 104);
});

test('leading and trailing separators', () => {
  const parseCell = vi.fn()
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'leading-empty',
      offset: 4000,
      length: 4444,
      icons: [],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'middle-content',
      offset: 5000,
      length: 5555,
      icons: [{ kind: 'text', offset: 5100, length: 5111, text: 'middle-text', prefix: 'mp' }],
      link: undefined,
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'cell',
      src: 'trailing-empty',
      offset: 6000,
      length: 6666,
      icons: [],
      link: undefined,
      params: undefined,
    });

  expect(parseCells('\\Content\\', 0, { parseCell })).toStrictEqual([
    {
      kind: 'cell',
      src: 'leading-empty',
      offset: 4000,
      length: 4444,
      icons: [],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'middle-content',
      offset: 5000,
      length: 5555,
      icons: [{ kind: 'text', offset: 5100, length: 5111, text: 'middle-text', prefix: 'mp' }],
      link: undefined,
      params: undefined,
    },
    {
      kind: 'cell',
      src: 'trailing-empty',
      offset: 6000,
      length: 6666,
      icons: [],
      link: undefined,
      params: undefined,
    },
  ]);

  expect(parseCell).toHaveBeenCalledTimes(3);
  expect(parseCell).toHaveBeenNthCalledWith(1, '', 0);
  expect(parseCell).toHaveBeenNthCalledWith(2, 'Content', 1);
  expect(parseCell).toHaveBeenNthCalledWith(3, '', 9);
});
