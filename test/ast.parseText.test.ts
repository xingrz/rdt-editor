import { expect, test, vi } from 'vitest';
import { parseText } from '@/ast';

test('single text', () => {
  expect(parseText('*Hello World', 0)).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 12,
    text: 'Hello World',
    prefix: '',
    params: undefined,
  });
});

test('empty', () => {
  expect(parseText('*', 0)).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 1,
    text: '',
    prefix: '',
    params: undefined,
  });
});

test('with prefix', () => {
  expect(parseText('foo*Hello World', 0)).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 15,
    text: 'Hello World',
    prefix: 'foo',
    params: undefined,
  });
});

test('with offset', () => {
  expect(parseText('*Hello World', 10)).toStrictEqual({
    kind: 'text',
    offset: 10,
    length: 12,
    text: 'Hello World',
    prefix: '',
    params: undefined,
  });
});

test('with params', () => {
  const parseParams = vi.fn().mockReturnValue({ foo: 'bar' });

  expect(parseText('*Hello World__size=2,color=red', 0, { parseParams })).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 30,
    text: 'Hello World',
    prefix: '',
    params: { foo: 'bar' },
  });

  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('size=2,color=red');
});

test('empty with params', () => {
  const parseParams = vi.fn().mockReturnValue({ foo: 'bar' });

  expect(parseText('*__bg=blue', 0, { parseParams })).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 10,
    text: '',
    prefix: '',
    params: { foo: 'bar' },
  });

  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('bg=blue');
});

test('with prefix and params', () => {
  const parseParams = vi.fn().mockReturnValue({ foo: 'bar' });

  expect(parseText('foo*Hello World__size=2,color=red', 0, { parseParams })).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 33,
    text: 'Hello World',
    prefix: 'foo',
    params: { foo: 'bar' },
  });

  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('size=2,color=red');
});

test('empty with prefix and params', () => {
  const parseParams = vi.fn().mockReturnValue({ foo: 'bar' });

  expect(parseText('foo*__bg=blue', 0, { parseParams })).toStrictEqual({
    kind: 'text',
    offset: 0,
    length: 13,
    text: '',
    prefix: 'foo',
    params: { foo: 'bar' },
  });

  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('bg=blue');
});
