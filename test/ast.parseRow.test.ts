import { expect, test, vi } from 'vitest';
import { parseRow } from '@/ast';

test('simple row with only cells', () => {
  const parseCells = vi.fn().mockReturnValue([
    { kind: 'cell', src: 'mock-cell', offset: 100, length: 111, icons: [], link: undefined, params: undefined },
  ]);
  const parseParams = vi.fn().mockReturnValue(undefined);

  expect(parseRow('STR\\DEX', 0, { parseCells, parseParams })).toStrictEqual({
    kind: 'row',
    offset: 0,
    length: 7,
    src: 'STR\\DEX',
    lInfo: [],
    rInfo: [],
    cells: [
      { kind: 'cell', src: 'mock-cell', offset: 100, length: 111, icons: [], link: undefined, params: undefined },
    ],
    params: undefined,
  });

  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('STR\\DEX', 0);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith(undefined);
});

test('row with left info only', () => {
  const parseLInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 1000, length: 1111, text: 'left-info-1', column: 1 },
    { kind: 'info', offset: 2000, length: 2222, text: 'left-info-2', column: 2 },
  ]);
  const parseCells = vi.fn().mockReturnValue([
    { kind: 'cell', src: 'left-cell', offset: 3000, length: 3333, icons: [], link: undefined, params: undefined },
  ]);
  const parseParams = vi.fn().mockReturnValue(undefined);

  expect(parseRow('Info1~~Info2! !STR', 10, { parseLInfos, parseCells, parseParams })).toStrictEqual({
    kind: 'row',
    offset: 10,
    length: 18,
    src: 'Info1~~Info2! !STR',
    lInfo: [
      { kind: 'info', offset: 1000, length: 1111, text: 'left-info-1', column: 1 },
      { kind: 'info', offset: 2000, length: 2222, text: 'left-info-2', column: 2 },
    ],
    rInfo: [],
    cells: [
      { kind: 'cell', src: 'left-cell', offset: 3000, length: 3333, icons: [], link: undefined, params: undefined },
    ],
    params: undefined,
  });

  expect(parseLInfos).toHaveBeenCalledOnce();
  expect(parseLInfos).toHaveBeenCalledWith('Info1~~Info2', 10, 'L');
  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('STR', 25);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith(undefined);
});

test('row with right info and params', () => {
  const parseRInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 4000, length: 4444, text: 'right-info-1', column: 1 },
    { kind: 'info', offset: 5000, length: 5555, text: 'right-info-2', column: 2 },
    { kind: 'info', offset: 6000, length: 6666, text: 'right-info-3', column: 3 },
    { kind: 'info', offset: 7000, length: 7777, text: 'right-info-4', column: 4 },
    { kind: 'info', offset: 8000, length: 8888, text: 'param-info', column: 5 },
  ]);
  const parseCells = vi.fn().mockReturnValue([
    { kind: 'cell', src: 'right-cell', offset: 9000, length: 9999, icons: [], link: undefined, params: undefined },
  ]);
  const parseParams = vi.fn().mockReturnValue({ color: 'blue', size: '3' });

  expect(parseRow('DEX~~Info1~~Info2~~Info3~~Info4~~param-info', 20, { parseRInfos, parseCells, parseParams })).toStrictEqual({
    kind: 'row',
    offset: 20,
    length: 43,
    src: 'DEX~~Info1~~Info2~~Info3~~Info4~~param-info',
    lInfo: [],
    rInfo: [
      { kind: 'info', offset: 4000, length: 4444, text: 'right-info-1', column: 1 },
      { kind: 'info', offset: 5000, length: 5555, text: 'right-info-2', column: 2 },
      { kind: 'info', offset: 6000, length: 6666, text: 'right-info-3', column: 3 },
      { kind: 'info', offset: 7000, length: 7777, text: 'right-info-4', column: 4 },
    ],
    cells: [
      { kind: 'cell', src: 'right-cell', offset: 9000, length: 9999, icons: [], link: undefined, params: undefined },
    ],
    params: { color: 'blue', size: '3' },
  });

  expect(parseRInfos).toHaveBeenCalledOnce();
  expect(parseRInfos).toHaveBeenCalledWith('Info1~~Info2~~Info3~~Info4~~param-info', 25, 'R');
  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('DEX', 20);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('param-info');
});

test('full row with left info, cells, and right info', () => {
  const parseLInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 1010, length: 1212, text: 'left-mock-1', column: 1 },
    { kind: 'info', offset: 2020, length: 2323, text: 'left-mock-2', column: 2 },
  ]);
  const parseRInfos = vi.fn().mockReturnValueOnce([
    { kind: 'info', offset: 3030, length: 3434, text: 'right-mock-1', column: 1 },
    { kind: 'info', offset: 4040, length: 4545, text: 'right-mock-2', column: 2 },
    { kind: 'info', offset: 5050, length: 5656, text: 'right-mock-3', column: 3 },
  ]);
  const parseCells = vi.fn().mockReturnValue([
    { kind: 'cell', src: 'full-cell-1', offset: 6060, length: 6767, icons: [], link: undefined, params: undefined },
    { kind: 'cell', src: 'full-cell-2', offset: 7070, length: 7878, icons: [], link: undefined, params: undefined },
  ]);
  const parseParams = vi.fn().mockReturnValue(undefined);

  expect(parseRow('L1~~L2! !STR\\DEX~~R1~~R2~~R3', 0, { parseLInfos, parseRInfos, parseCells, parseParams })).toStrictEqual({
    kind: 'row',
    offset: 0,
    length: 28,
    src: 'L1~~L2! !STR\\DEX~~R1~~R2~~R3',
    lInfo: [
      { kind: 'info', offset: 1010, length: 1212, text: 'left-mock-1', column: 1 },
      { kind: 'info', offset: 2020, length: 2323, text: 'left-mock-2', column: 2 },
    ],
    rInfo: [
      { kind: 'info', offset: 3030, length: 3434, text: 'right-mock-1', column: 1 },
      { kind: 'info', offset: 4040, length: 4545, text: 'right-mock-2', column: 2 },
      { kind: 'info', offset: 5050, length: 5656, text: 'right-mock-3', column: 3 },
    ],
    cells: [
      { kind: 'cell', src: 'full-cell-1', offset: 6060, length: 6767, icons: [], link: undefined, params: undefined },
      { kind: 'cell', src: 'full-cell-2', offset: 7070, length: 7878, icons: [], link: undefined, params: undefined },
    ],
    params: undefined,
  });

  expect(parseLInfos).toHaveBeenCalledOnce();
  expect(parseLInfos).toHaveBeenCalledWith('L1~~L2', 0, 'L');
  expect(parseRInfos).toHaveBeenCalledOnce();
  expect(parseRInfos).toHaveBeenCalledWith('R1~~R2~~R3', 18, 'R');
  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('STR\\DEX', 9);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith(undefined);
});

test('empty row', () => {
  const parseCells = vi.fn().mockReturnValue([
    { kind: 'cell', src: 'empty-cell', offset: 8080, length: 8989, icons: [], link: undefined, params: undefined },
  ]);

  expect(parseRow('', 50, { parseCells })).toStrictEqual({
    kind: 'row',
    offset: 50,
    length: 0,
    src: '',
    lInfo: [],
    rInfo: [],
    cells: [
      { kind: 'cell', src: 'empty-cell', offset: 8080, length: 8989, icons: [], link: undefined, params: undefined },
    ],
    params: undefined,
  });

  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('', 50);
});

test('row with truncated info arrays', () => {
  const parseLInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 9000, length: 9111, text: 'left-1', column: 1 },
    { kind: 'info', offset: 9200, length: 9222, text: 'left-2', column: 2 },
    { kind: 'info', offset: 9300, length: 9333, text: 'left-3', column: 3 },
    { kind: 'info', offset: 9400, length: 9444, text: 'left-4', column: 4 },
    { kind: 'info', offset: 9500, length: 9555, text: 'left-5', column: 5 },
  ]);
  const parseRInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 1000, length: 1111, text: 'right-1', column: 1 },
    { kind: 'info', offset: 1200, length: 1222, text: 'right-2', column: 2 },
    { kind: 'info', offset: 1300, length: 1333, text: 'right-3', column: 3 },
    { kind: 'info', offset: 1400, length: 1444, text: 'right-4', column: 4 },
    { kind: 'info', offset: 1500, length: 1555, text: 'right-5', column: 5 },
    { kind: 'info', offset: 1600, length: 1666, text: 'right-6', column: 6 },
  ]);
  const parseCells = vi.fn().mockReturnValue([]);
  const parseParams = vi.fn().mockReturnValue({ truncated: 'test' });

  expect(parseRow('L1~~L2~~L3~~L4~~L5! !STR~~R1~~R2~~R3~~R4~~R5~~R6', 0, { parseLInfos, parseRInfos, parseCells, parseParams })).toStrictEqual({
    kind: 'row',
    offset: 0,
    length: 48,
    src: 'L1~~L2~~L3~~L4~~L5! !STR~~R1~~R2~~R3~~R4~~R5~~R6',
    lInfo: [
      { kind: 'info', offset: 9000, length: 9111, text: 'left-1', column: 1 },
      { kind: 'info', offset: 9200, length: 9222, text: 'left-2', column: 2 },
      { kind: 'info', offset: 9300, length: 9333, text: 'left-3', column: 3 },
      { kind: 'info', offset: 9400, length: 9444, text: 'left-4', column: 4 },
    ],
    rInfo: [
      { kind: 'info', offset: 1000, length: 1111, text: 'right-1', column: 1 },
      { kind: 'info', offset: 1200, length: 1222, text: 'right-2', column: 2 },
      { kind: 'info', offset: 1300, length: 1333, text: 'right-3', column: 3 },
      { kind: 'info', offset: 1400, length: 1444, text: 'right-4', column: 4 },
    ],
    cells: [],
    params: { truncated: 'test' },
  });

  expect(parseLInfos).toHaveBeenCalledOnce();
  expect(parseLInfos).toHaveBeenCalledWith('L1~~L2~~L3~~L4~~L5', 0, 'L');
  expect(parseRInfos).toHaveBeenCalledOnce();
  expect(parseRInfos).toHaveBeenCalledWith('R1~~R2~~R3~~R4~~R5~~R6', 26, 'R');
  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('STR', 21);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('right-5');
});

test('row with complex offset calculations', () => {
  const parseLInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 2000, length: 2111, text: 'complex-left', column: 1 },
  ]);
  const parseRInfos = vi.fn().mockReturnValue([
    { kind: 'info', offset: 3000, length: 3111, text: 'complex-right', column: 1 },
  ]);
  const parseCells = vi.fn().mockReturnValue([
    { kind: 'cell', src: 'complex-cell', offset: 4000, length: 4111, icons: [], link: undefined, params: undefined },
  ]);
  const parseParams = vi.fn().mockReturnValue(undefined);

  expect(parseRow('LeftInfo! !CellContent~~RightInfo', 100, { parseLInfos, parseRInfos, parseCells, parseParams })).toStrictEqual({
    kind: 'row',
    offset: 100,
    length: 33,
    src: 'LeftInfo! !CellContent~~RightInfo',
    lInfo: [{ kind: 'info', offset: 2000, length: 2111, text: 'complex-left', column: 1 }],
    rInfo: [{ kind: 'info', offset: 3000, length: 3111, text: 'complex-right', column: 1 }],
    cells: [{ kind: 'cell', src: 'complex-cell', offset: 4000, length: 4111, icons: [], link: undefined, params: undefined }],
    params: undefined,
  });

  expect(parseLInfos).toHaveBeenCalledOnce();
  expect(parseLInfos).toHaveBeenCalledWith('LeftInfo', 100, 'L');
  expect(parseRInfos).toHaveBeenCalledOnce();
  expect(parseRInfos).toHaveBeenCalledWith('RightInfo', 124, 'R');
  expect(parseCells).toHaveBeenCalledOnce();
  expect(parseCells).toHaveBeenCalledWith('CellContent', 111);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith(undefined);
});
