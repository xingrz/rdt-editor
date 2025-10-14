import { expect, test } from 'vitest';
import { parseParams } from '@/ast';

test('single param', () => {
  expect(parseParams('size=2')).toStrictEqual({ size: '2' });
});

test('multiple params', () => {
  expect(parseParams('size=2,color=red')).toStrictEqual({ size: '2', color: 'red' });
});

test('no params', () => {
  expect(parseParams('')).toBeUndefined();
});

test('undefined', () => {
  expect(parseParams(undefined)).toBeUndefined();
});

test('trailing comma', () => {
  expect(parseParams('size=2,color=red,')).toStrictEqual({ size: '2', color: 'red' });
});

test('leading comma', () => {
  expect(parseParams(',size=2,color=red')).toStrictEqual({ size: '2', color: 'red' });
});

test('extra equals', () => {
  expect(parseParams('data=a=b=c')).toStrictEqual({ data: 'a=b=c' });
});

test('empty key', () => {
  expect(parseParams('=value')).toStrictEqual({});
});

test('empty key and value', () => {
  expect(parseParams('=')).toStrictEqual({});
});

test('only comma', () => {
  expect(parseParams(',')).toStrictEqual({});
});
