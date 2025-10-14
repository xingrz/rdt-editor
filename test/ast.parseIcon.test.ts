import { expect, test, vi } from 'vitest';
import { parseIcon } from '@/ast';

test('single icon', () => {
  expect(parseIcon('STR', 0)).toStrictEqual({
    kind: 'icon',
    offset: 0,
    length: 3,
    name: 'STR',
    params: undefined,
  });
});

test('empty', () => {
  expect(parseIcon('', 0)).toStrictEqual({
    kind: 'icon',
    offset: 0,
    length: 0,
    name: '',
    params: undefined,
  });
});

test('with offset', () => {
  expect(parseIcon('STR', 10)).toStrictEqual({
    kind: 'icon',
    offset: 10,
    length: 3,
    name: 'STR',
    params: undefined,
  });
});

test('with params', () => {
  const parseParams = vi.fn().mockReturnValue({ foo: 'bar' });

  expect(parseIcon('STR__size=2,color=red', 0, { parseParams })).toStrictEqual({
    kind: 'icon',
    offset: 0,
    length: 21,
    name: 'STR',
    params: { foo: 'bar' },
  });

  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('size=2,color=red');
});

test('empty with params', () => {
  const parseParams = vi.fn().mockReturnValue({ foo: 'bar' });

  expect(parseIcon('__bg=blue', 0, { parseParams })).toStrictEqual({
    kind: 'icon',
    offset: 0,
    length: 9,
    name: '',
    params: { foo: 'bar' },
  });

  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('bg=blue');
});
