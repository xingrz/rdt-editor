import { expect, test, vi } from 'vitest';
import { parseIcons } from '@/ast';

test('single icon', () => {
  const parseIcon = vi.fn().mockReturnValue({ kind: 'icon', offset: 0, length: 999, name: 'foo' });

  expect(parseIcons('STR', 0, { parseIcon })).toStrictEqual([
    { kind: 'icon', offset: 0, length: 999, name: 'foo' },
  ]);

  expect(parseIcon).toHaveBeenCalledOnce();
  expect(parseIcon).toHaveBeenCalledWith('STR', 0);
});

test('single text', () => {
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 0, length: 999, text: 'foo', prefix: '' });

  expect(parseIcons('*Hello World', 0, { parseText })).toStrictEqual([
    { kind: 'text', offset: 0, length: 999, text: 'foo', prefix: '' },
  ]);

  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*Hello World', 0);
});

test('mixed', () => {
  const parseIcon = vi.fn()
    .mockReturnValueOnce({ kind: 'icon', offset: 0, length: 111, name: 'foo' })
    .mockReturnValueOnce({ kind: 'icon', offset: 2, length: 333, name: 'bar' });
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 1, length: 222, text: 'foo', prefix: '' });

  expect(parseIcons('STR!~*Hello World!~DEX', 0, { parseIcon, parseText })).toStrictEqual([
    { kind: 'icon', offset: 0, length: 111, name: 'foo' },
    { kind: 'text', offset: 1, length: 222, text: 'foo', prefix: '' },
    { kind: 'icon', offset: 2, length: 333, name: 'bar' },
  ]);

  expect(parseIcon).toHaveBeenCalledTimes(2);
  expect(parseIcon).toHaveBeenNthCalledWith(1, 'STR', 0);
  expect(parseIcon).toHaveBeenNthCalledWith(2, 'DEX', 19);
  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*Hello World', 5);
});

test('empty', () => {
  const parseIcon = vi.fn().mockReturnValue({ kind: 'icon', offset: 0, length: 111, name: 'foo' });

  expect(parseIcons('', 0, { parseIcon })).toStrictEqual([
    { kind: 'icon', offset: 0, length: 111, name: 'foo' },
  ]);

  expect(parseIcon).toHaveBeenCalledOnce();
  expect(parseIcon).toHaveBeenCalledWith('', 0);
});

test('only splitter', () => {
  const parseIcon = vi.fn()
    .mockReturnValueOnce({ kind: 'icon', offset: 0, length: 111, name: 'aaa' })
    .mockReturnValueOnce({ kind: 'icon', offset: 1, length: 222, name: 'bbb' })
    .mockReturnValueOnce({ kind: 'icon', offset: 2, length: 333, name: 'ccc' });

  expect(parseIcons('!~!~', 0, { parseIcon })).toStrictEqual([
    { kind: 'icon', offset: 0, length: 111, name: 'aaa' },
    { kind: 'icon', offset: 1, length: 222, name: 'bbb' },
    { kind: 'icon', offset: 2, length: 333, name: 'ccc' },
  ]);

  expect(parseIcon).toHaveBeenCalledTimes(3);
  expect(parseIcon).toHaveBeenNthCalledWith(1, '', 0);
  expect(parseIcon).toHaveBeenNthCalledWith(2, '', 2);
  expect(parseIcon).toHaveBeenNthCalledWith(3, '', 4);
});

test('leading and trailing splitter', () => {
  const parseIcon = vi.fn()
    .mockReturnValueOnce({ kind: 'icon', offset: 100, length: 111, name: 'empty1' })
    .mockReturnValueOnce({ kind: 'icon', offset: 200, length: 222, name: 'mock-str' })
    .mockReturnValueOnce({ kind: 'icon', offset: 300, length: 333, name: 'mock-dex' })
    .mockReturnValueOnce({ kind: 'icon', offset: 400, length: 444, name: 'empty2' });
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 500, length: 555, text: 'mock-text', prefix: 'mock-prefix' });

  expect(parseIcons('!~STR!~*Hello World!~DEX!~', 0, { parseIcon, parseText })).toStrictEqual([
    { kind: 'icon', offset: 100, length: 111, name: 'empty1' },
    { kind: 'icon', offset: 200, length: 222, name: 'mock-str' },
    { kind: 'text', offset: 500, length: 555, text: 'mock-text', prefix: 'mock-prefix' },
    { kind: 'icon', offset: 300, length: 333, name: 'mock-dex' },
    { kind: 'icon', offset: 400, length: 444, name: 'empty2' },
  ]);

  expect(parseIcon).toHaveBeenCalledTimes(4);
  expect(parseIcon).toHaveBeenNthCalledWith(1, '', 0);
  expect(parseIcon).toHaveBeenNthCalledWith(2, 'STR', 2);
  expect(parseIcon).toHaveBeenNthCalledWith(3, 'DEX', 21);
  expect(parseIcon).toHaveBeenNthCalledWith(4, '', 26);
  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*Hello World', 7);
});

test('consecutive splitters', () => {
  const parseIcon = vi.fn()
    .mockReturnValueOnce({ kind: 'icon', offset: 1010, length: 1111, name: 'first-icon' })
    .mockReturnValueOnce({ kind: 'icon', offset: 2020, length: 2222, name: 'empty-middle1' })
    .mockReturnValueOnce({ kind: 'icon', offset: 3030, length: 3333, name: 'empty-middle2' })
    .mockReturnValueOnce({ kind: 'icon', offset: 4040, length: 4444, name: 'last-icon' });
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 5050, length: 5555, text: 'fake-text', prefix: 'fake-prefix' });

  expect(parseIcons('STR!~!~*Hello World!~!~DEX', 0, { parseIcon, parseText })).toStrictEqual([
    { kind: 'icon', offset: 1010, length: 1111, name: 'first-icon' },
    { kind: 'icon', offset: 2020, length: 2222, name: 'empty-middle1' },
    { kind: 'text', offset: 5050, length: 5555, text: 'fake-text', prefix: 'fake-prefix' },
    { kind: 'icon', offset: 3030, length: 3333, name: 'empty-middle2' },
    { kind: 'icon', offset: 4040, length: 4444, name: 'last-icon' },
  ]);

  expect(parseIcon).toHaveBeenCalledTimes(4);
  expect(parseIcon).toHaveBeenNthCalledWith(1, 'STR', 0);
  expect(parseIcon).toHaveBeenNthCalledWith(2, '', 5);
  expect(parseIcon).toHaveBeenNthCalledWith(3, '', 21);
  expect(parseIcon).toHaveBeenNthCalledWith(4, 'DEX', 23);
  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*Hello World', 7);
});

test('only text', () => {
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 7777, length: 8888, text: 'single-text', prefix: 'single-prefix', params: { mock: 'data' } });

  expect(parseIcons('*Hello World', 0, { parseText })).toStrictEqual([
    { kind: 'text', offset: 7777, length: 8888, text: 'single-text', prefix: 'single-prefix', params: { mock: 'data' } },
  ]);

  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*Hello World', 0);
});

test('only empty text', () => {
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 9999, length: 1010, text: 'empty-mock', prefix: 'empty-prefix', params: { empty: 'mock' } });

  expect(parseIcons('*', 0, { parseText })).toStrictEqual([
    { kind: 'text', offset: 9999, length: 1010, text: 'empty-mock', prefix: 'empty-prefix', params: { empty: 'mock' } },
  ]);

  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*', 0);
});

test('with params', () => {
  const parseIcon = vi.fn().mockReturnValue({ kind: 'icon', offset: 1212, length: 1313, name: 'param-icon', params: { mock: 'icon-params' } });
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 1414, length: 1515, text: 'param-text', prefix: 'param-prefix', params: { mock: 'text-params' } });

  expect(parseIcons('STR__size=2,color=red!~*Hello World__bg=blue', 0, { parseIcon, parseText })).toStrictEqual([
    { kind: 'icon', offset: 1212, length: 1313, name: 'param-icon', params: { mock: 'icon-params' } },
    { kind: 'text', offset: 1414, length: 1515, text: 'param-text', prefix: 'param-prefix', params: { mock: 'text-params' } },
  ]);

  expect(parseIcon).toHaveBeenCalledOnce();
  expect(parseIcon).toHaveBeenCalledWith('STR__size=2,color=red', 0);
  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*Hello World__bg=blue', 23);
});

test('empty with params', () => {
  const parseText = vi.fn().mockReturnValue({ kind: 'text', offset: 1616, length: 1717, text: 'empty-param-text', prefix: 'empty-param-prefix', params: { mock: 'empty-params' } });

  expect(parseIcons('*__size=2,color=red', 0, { parseText })).toStrictEqual([
    { kind: 'text', offset: 1616, length: 1717, text: 'empty-param-text', prefix: 'empty-param-prefix', params: { mock: 'empty-params' } },
  ]);

  expect(parseText).toHaveBeenCalledOnce();
  expect(parseText).toHaveBeenCalledWith('*__size=2,color=red', 0);
});
