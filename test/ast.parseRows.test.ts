import { expect, test, vi } from 'vitest';
import { parseRows } from '@/ast';

test('single row', () => {
  const parseRow = vi.fn().mockReturnValue({
    kind: 'row',
    offset: 100,
    length: 111,
    src: 'mock-row',
    lInfo: [],
    rInfo: [],
    cells: [{ kind: 'cell', src: 'mock-cell', offset: 200, length: 222, icons: [], link: undefined, params: undefined }],
    params: undefined,
  });

  expect(parseRows('STR\\DEX', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 100,
      length: 111,
      src: 'mock-row',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'mock-cell', offset: 200, length: 222, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledOnce();
  expect(parseRow).toHaveBeenCalledWith('STR\\DEX', 0);
});

test('single row of keyword', () => {
  const parseKeyword = vi.fn().mockReturnValue({
    kind: 'keyword',
    offset: 300,
    length: 333,
    src: 'mock-keyword',
    func: 'mock',
    args: ['keyword'],
  });

  expect(parseRows('-startCollapsible-collapsed-replace', { parseKeyword })).toStrictEqual([
    {
      kind: 'keyword',
      offset: 300,
      length: 333,
      src: 'mock-keyword',
      func: 'mock',
      args: ['keyword'],
    },
  ]);

  expect(parseKeyword).toHaveBeenCalledOnce();
  expect(parseKeyword).toHaveBeenCalledWith('-startCollapsible-collapsed-replace', 0);
});

test('multiple rows with LF', () => {
  const parseRow = vi.fn()
    .mockReturnValueOnce({
      kind: 'row',
      offset: 1000,
      length: 1111,
      src: 'first-row',
      lInfo: [{ kind: 'info', offset: 1200, length: 1222, text: 'first-left', column: 1 }],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 2000,
      length: 2222,
      src: 'second-row',
      lInfo: [],
      rInfo: [{ kind: 'info', offset: 2200, length: 2333, text: 'second-right', column: 1 }],
      cells: [],
      params: { color: 'blue' },
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 3000,
      length: 3333,
      src: 'third-row',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'third-cell', offset: 3100, length: 3111, icons: [], link: undefined, params: undefined }],
      params: undefined,
    });

  expect(parseRows('Row1\nRow2\nRow3', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 1000,
      length: 1111,
      src: 'first-row',
      lInfo: [{ kind: 'info', offset: 1200, length: 1222, text: 'first-left', column: 1 }],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 2000,
      length: 2222,
      src: 'second-row',
      lInfo: [],
      rInfo: [{ kind: 'info', offset: 2200, length: 2333, text: 'second-right', column: 1 }],
      cells: [],
      params: { color: 'blue' },
    },
    {
      kind: 'row',
      offset: 3000,
      length: 3333,
      src: 'third-row',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'third-cell', offset: 3100, length: 3111, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledTimes(3);
  expect(parseRow).toHaveBeenNthCalledWith(1, 'Row1', 0);
  expect(parseRow).toHaveBeenNthCalledWith(2, 'Row2', 5);
  expect(parseRow).toHaveBeenNthCalledWith(3, 'Row3', 10);
});

test('multiple rows with CRLF', () => {
  const parseRow = vi.fn()
    .mockReturnValueOnce({
      kind: 'row',
      offset: 4000,
      length: 4444,
      src: 'crlf-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 5000,
      length: 5555,
      src: 'crlf-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    });

  expect(parseRows('FirstRow\r\nSecondRow', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 4000,
      length: 4444,
      src: 'crlf-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 5000,
      length: 5555,
      src: 'crlf-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledTimes(2);
  expect(parseRow).toHaveBeenNthCalledWith(1, 'FirstRow', 0);
  expect(parseRow).toHaveBeenNthCalledWith(2, 'SecondRow', 10);
});

test('empty rows', () => {
  const parseRow = vi.fn()
    .mockReturnValueOnce({
      kind: 'row',
      offset: 6000,
      length: 6666,
      src: 'empty-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 7000,
      length: 7777,
      src: 'empty-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 8000,
      length: 8888,
      src: 'empty-row-3',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    });

  expect(parseRows('\n\n', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 6000,
      length: 6666,
      src: 'empty-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 7000,
      length: 7777,
      src: 'empty-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 8000,
      length: 8888,
      src: 'empty-row-3',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledTimes(3);
  expect(parseRow).toHaveBeenNthCalledWith(1, '', 0);
  expect(parseRow).toHaveBeenNthCalledWith(2, '', 1);
  expect(parseRow).toHaveBeenNthCalledWith(3, '', 2);
});

test('empty string', () => {
  const parseRow = vi.fn().mockReturnValue({
    kind: 'row',
    offset: 9000,
    length: 9999,
    src: 'single-empty-row',
    lInfo: [],
    rInfo: [],
    cells: [],
    params: undefined,
  });

  expect(parseRows('', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 9000,
      length: 9999,
      src: 'single-empty-row',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledOnce();
  expect(parseRow).toHaveBeenCalledWith('', 0);
});

test('mixed empty and content rows', () => {
  const parseRow = vi.fn()
    .mockReturnValueOnce({
      kind: 'row',
      offset: 1100,
      length: 1212,
      src: 'content-row',
      lInfo: [{ kind: 'info', offset: 1300, length: 1333, text: 'content-info', column: 1 }],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'content-cell', offset: 1400, length: 1444, icons: [], link: undefined, params: undefined }],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 2100,
      length: 2222,
      src: 'empty-middle-row',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 3100,
      length: 3333,
      src: 'another-content-row',
      lInfo: [],
      rInfo: [{ kind: 'info', offset: 3400, length: 3444, text: 'another-info', column: 1 }],
      cells: [],
      params: { bg: 'red' },
    });

  expect(parseRows('Info! !STR\n\nVIT~~AnotherInfo', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 1100,
      length: 1212,
      src: 'content-row',
      lInfo: [{ kind: 'info', offset: 1300, length: 1333, text: 'content-info', column: 1 }],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'content-cell', offset: 1400, length: 1444, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 2100,
      length: 2222,
      src: 'empty-middle-row',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 3100,
      length: 3333,
      src: 'another-content-row',
      lInfo: [],
      rInfo: [{ kind: 'info', offset: 3400, length: 3444, text: 'another-info', column: 1 }],
      cells: [],
      params: { bg: 'red' },
    },
  ]);

  expect(parseRow).toHaveBeenCalledTimes(3);
  expect(parseRow).toHaveBeenNthCalledWith(1, 'Info! !STR', 0);
  expect(parseRow).toHaveBeenNthCalledWith(2, '', 11);
  expect(parseRow).toHaveBeenNthCalledWith(3, 'VIT~~AnotherInfo', 12);
});

test('trailing newlines', () => {
  const parseRow = vi.fn()
    .mockReturnValueOnce({
      kind: 'row',
      offset: 4100,
      length: 4444,
      src: 'trailing-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 5100,
      length: 5555,
      src: 'trailing-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 6100,
      length: 6666,
      src: 'trailing-empty',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    });

  expect(parseRows('Row1\nRow2\n', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 4100,
      length: 4444,
      src: 'trailing-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 5100,
      length: 5555,
      src: 'trailing-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 6100,
      length: 6666,
      src: 'trailing-empty',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledTimes(3);
  expect(parseRow).toHaveBeenNthCalledWith(1, 'Row1', 0);
  expect(parseRow).toHaveBeenNthCalledWith(2, 'Row2', 5);
  expect(parseRow).toHaveBeenNthCalledWith(3, '', 10);
});

test('complex rows with various content', () => {
  const parseRow = vi.fn()
    .mockReturnValueOnce({
      kind: 'row',
      offset: 7100,
      length: 7777,
      src: 'complex-row-1',
      lInfo: [
        { kind: 'info', offset: 7200, length: 7222, text: 'left-1', column: 1 },
        { kind: 'info', offset: 7300, length: 7333, text: 'left-2', column: 2 }
      ],
      rInfo: [
        { kind: 'info', offset: 7400, length: 7444, text: 'right-1', column: 1 }
      ],
      cells: [
        { kind: 'cell', src: 'complex-cell-1', offset: 7500, length: 7555, icons: [], link: 'link1', params: { param1: 'value1' } }
      ],
      params: { row: 'param1' },
    })
    .mockReturnValueOnce({
      kind: 'row',
      offset: 8100,
      length: 8888,
      src: 'complex-row-2',
      lInfo: [],
      rInfo: [
        { kind: 'info', offset: 8200, length: 8222, text: 'right-only-1', column: 1 },
        { kind: 'info', offset: 8300, length: 8333, text: 'right-only-2', column: 2 }
      ],
      cells: [
        { kind: 'cell', src: 'complex-cell-2', offset: 8400, length: 8444, icons: [], link: undefined, params: undefined },
        { kind: 'cell', src: 'complex-cell-3', offset: 8500, length: 8555, icons: [], link: 'link2', params: undefined }
      ],
      params: undefined,
    });

  expect(parseRows('L1~~L2! !STR!@link1!_param1=value1~~R1~~row=param1\nDEX\\VIT!@link2~~RO1~~RO2', { parseRow })).toStrictEqual([
    {
      kind: 'row',
      offset: 7100,
      length: 7777,
      src: 'complex-row-1',
      lInfo: [
        { kind: 'info', offset: 7200, length: 7222, text: 'left-1', column: 1 },
        { kind: 'info', offset: 7300, length: 7333, text: 'left-2', column: 2 }
      ],
      rInfo: [
        { kind: 'info', offset: 7400, length: 7444, text: 'right-1', column: 1 }
      ],
      cells: [
        { kind: 'cell', src: 'complex-cell-1', offset: 7500, length: 7555, icons: [], link: 'link1', params: { param1: 'value1' } }
      ],
      params: { row: 'param1' },
    },
    {
      kind: 'row',
      offset: 8100,
      length: 8888,
      src: 'complex-row-2',
      lInfo: [],
      rInfo: [
        { kind: 'info', offset: 8200, length: 8222, text: 'right-only-1', column: 1 },
        { kind: 'info', offset: 8300, length: 8333, text: 'right-only-2', column: 2 }
      ],
      cells: [
        { kind: 'cell', src: 'complex-cell-2', offset: 8400, length: 8444, icons: [], link: undefined, params: undefined },
        { kind: 'cell', src: 'complex-cell-3', offset: 8500, length: 8555, icons: [], link: 'link2', params: undefined }
      ],
      params: undefined,
    },
  ]);

  expect(parseRow).toHaveBeenCalledTimes(2);
  expect(parseRow).toHaveBeenNthCalledWith(1, 'L1~~L2! !STR!@link1!_param1=value1~~R1~~row=param1', 0);
  expect(parseRow).toHaveBeenNthCalledWith(2, 'DEX\\VIT!@link2~~RO1~~RO2', 51);
});
