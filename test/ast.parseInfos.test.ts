import { expect, test, vi } from 'vitest';
import { parseInfos } from '@/ast';

test('single item with L placement', () => {
  const parseInfo = vi.fn().mockReturnValue({ kind: 'info', offset: 100, length: 111, text: 'mock-info', column: 2 });

  expect(parseInfos('Hello', 10, 'L', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 100, length: 111, text: 'mock-info', column: 2 },
  ]);

  expect(parseInfo).toHaveBeenCalledOnce();
  expect(parseInfo).toHaveBeenCalledWith('Hello', 10, 0, 1);
});

test('single item with R placement', () => {
  const parseInfo = vi.fn().mockReturnValue({ kind: 'info', offset: 200, length: 222, text: 'mock-right', column: 2 });

  expect(parseInfos('World', 20, 'R', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 200, length: 222, text: 'mock-right', column: 2 },
  ]);

  expect(parseInfo).toHaveBeenCalledOnce();
  expect(parseInfo).toHaveBeenCalledWith('World', 20, 0, 1);
});

test('multiple items with L placement (reversed)', () => {
  const parseInfo = vi.fn()
    .mockReturnValueOnce({ kind: 'info', offset: 1000, length: 1111, text: 'first-mock', column: 1 })
    .mockReturnValueOnce({ kind: 'info', offset: 2000, length: 2222, text: 'second-mock', column: 2 })
    .mockReturnValueOnce({ kind: 'info', offset: 3000, length: 3333, text: 'third-mock', column: 3 });

  expect(parseInfos('Third~~Second~~First', 0, 'L', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 1000, length: 1111, text: 'first-mock', column: 1 },
    { kind: 'info', offset: 2000, length: 2222, text: 'second-mock', column: 2 },
    { kind: 'info', offset: 3000, length: 3333, text: 'third-mock', column: 3 },
  ]);

  expect(parseInfo).toHaveBeenCalledTimes(3);
  expect(parseInfo).toHaveBeenNthCalledWith(1, 'First', 15, 0, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(2, 'Second', 7, 1, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(3, 'Third', 0, 2, 3);
});

test('multiple items with R placement (normal order)', () => {
  const parseInfo = vi.fn()
    .mockReturnValueOnce({ kind: 'info', offset: 4000, length: 4444, text: 'alpha-mock', column: 1 })
    .mockReturnValueOnce({ kind: 'info', offset: 5000, length: 5555, text: 'beta-mock', column: 2 })
    .mockReturnValueOnce({ kind: 'info', offset: 6000, length: 6666, text: 'gamma-mock', column: 3 });

  expect(parseInfos('Alpha~~Beta~~Gamma', 50, 'R', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 4000, length: 4444, text: 'alpha-mock', column: 1 },
    { kind: 'info', offset: 5000, length: 5555, text: 'beta-mock', column: 2 },
    { kind: 'info', offset: 6000, length: 6666, text: 'gamma-mock', column: 3 },
  ]);

  expect(parseInfo).toHaveBeenCalledTimes(3);
  expect(parseInfo).toHaveBeenNthCalledWith(1, 'Alpha', 50, 0, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(2, 'Beta', 57, 1, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(3, 'Gamma', 63, 2, 3);
});

test('empty string', () => {
  expect(parseInfos('', 0, 'R')).toStrictEqual([]);
});

test('1 splitter and 2 empty parts', () => {
  const parseInfo = vi.fn()
    .mockReturnValueOnce({ kind: 'info', offset: 7000, length: 7777, text: 'empty1', column: 1 })
    .mockReturnValueOnce({ kind: 'info', offset: 8000, length: 8888, text: 'empty2', column: 2 });

  expect(parseInfos('~~', 0, 'R', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 7000, length: 7777, text: 'empty1', column: 1 },
    { kind: 'info', offset: 8000, length: 8888, text: 'empty2', column: 2 },
  ]);

  expect(parseInfo).toHaveBeenCalledTimes(2);
  expect(parseInfo).toHaveBeenNthCalledWith(1, '', 0, 0, 2);
  expect(parseInfo).toHaveBeenNthCalledWith(2, '', 2, 1, 2);
});

test('2 splitters and 3 empty parts', () => {
  const parseInfo = vi.fn()
    .mockReturnValueOnce({ kind: 'info', offset: 1000, length: 1111, text: 'empty1', column: 1 })
    .mockReturnValueOnce({ kind: 'info', offset: 2000, length: 2222, text: 'empty2', column: 2 })
    .mockReturnValueOnce({ kind: 'info', offset: 3000, length: 3333, text: 'empty3', column: 3 });

  expect(parseInfos('~~ ~~', 0, 'R', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 1000, length: 1111, text: 'empty1', column: 1 },
    { kind: 'info', offset: 2000, length: 2222, text: 'empty2', column: 2 },
    { kind: 'info', offset: 3000, length: 3333, text: 'empty3', column: 3 },
  ]);

  expect(parseInfo).toHaveBeenCalledTimes(3);
  expect(parseInfo).toHaveBeenNthCalledWith(1, '', 0, 0, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(2, ' ', 2, 1, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(3, '', 5, 2, 3);
});

test('3 splitters and 4 empty parts', () => {
  const parseInfo = vi.fn()
    .mockReturnValueOnce({ kind: 'info', offset: 1000, length: 1111, text: 'empty1', column: 1 })
    .mockReturnValueOnce({ kind: 'info', offset: 2000, length: 2222, text: 'empty2', column: 2 })
    .mockReturnValueOnce({ kind: 'info', offset: 3000, length: 3333, text: 'empty3', column: 3 })
    .mockReturnValueOnce({ kind: 'info', offset: 4000, length: 4444, text: 'empty4', column: 4 });

  expect(parseInfos('~~ ~~ ~~', 0, 'R', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 1000, length: 1111, text: 'empty1', column: 1 },
    { kind: 'info', offset: 2000, length: 2222, text: 'empty2', column: 2 },
    { kind: 'info', offset: 3000, length: 3333, text: 'empty3', column: 3 },
    { kind: 'info', offset: 4000, length: 4444, text: 'empty4', column: 4 },
  ]);

  expect(parseInfo).toHaveBeenCalledTimes(4);
  expect(parseInfo).toHaveBeenNthCalledWith(1, '', 0, 0, 4);
  expect(parseInfo).toHaveBeenNthCalledWith(2, ' ', 2, 1, 4);
  expect(parseInfo).toHaveBeenNthCalledWith(3, ' ', 5, 2, 4);
  expect(parseInfo).toHaveBeenNthCalledWith(4, '', 8, 3, 4);
});

test('mixed empty and content with L placement', () => {
  const parseInfo = vi.fn()
    .mockReturnValueOnce({ kind: 'info', offset: 1010, length: 1212, text: 'empty-mock', column: 1 })
    .mockReturnValueOnce({ kind: 'info', offset: 2020, length: 2323, text: 'content-mock', column: 2 })
    .mockReturnValueOnce({ kind: 'info', offset: 3030, length: 3434, text: 'another-mock', column: 3 });

  expect(parseInfos('~~Content~~', 10, 'L', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 1010, length: 1212, text: 'empty-mock', column: 1 },
    { kind: 'info', offset: 2020, length: 2323, text: 'content-mock', column: 2 },
    { kind: 'info', offset: 3030, length: 3434, text: 'another-mock', column: 3 },
  ]);

  expect(parseInfo).toHaveBeenCalledTimes(3);
  expect(parseInfo).toHaveBeenNthCalledWith(1, '', 21, 0, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(2, 'Content', 12, 1, 3);
  expect(parseInfo).toHaveBeenNthCalledWith(3, '', 10, 2, 3);
});

test('with offset calculation', () => {
  const parseInfo = vi.fn().mockReturnValue({ kind: 'info', offset: 9999, length: 1111, text: 'offset-test', column: 1 });

  expect(parseInfos('Test', 100, 'R', { parseInfo })).toStrictEqual([
    { kind: 'info', offset: 9999, length: 1111, text: 'offset-test', column: 1 },
  ]);

  expect(parseInfo).toHaveBeenCalledOnce();
  expect(parseInfo).toHaveBeenCalledWith('Test', 100, 0, 1);
});
