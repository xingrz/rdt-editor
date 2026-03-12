import { expect, test } from 'vitest';
import { split } from '@/utils/split';

test('split by string delimiter', () => {
  expect(split('a\\b\\c', '\\')).toStrictEqual([
    { part: 'a', offset: 0, tail: '\\' },
    { part: 'b', offset: 2, tail: '\\' },
    { part: 'c', offset: 4 },
  ]);
});

test('no delimiter found', () => {
  expect(split('abc', '\\')).toStrictEqual([
    { part: 'abc', offset: 0 },
  ]);
});

test('empty string', () => {
  expect(split('', '\\')).toStrictEqual([
    { part: '', offset: 0 },
  ]);
});

test('delimiter at start', () => {
  expect(split('\\a\\b', '\\')).toStrictEqual([
    { part: '', offset: 0, tail: '\\' },
    { part: 'a', offset: 1, tail: '\\' },
    { part: 'b', offset: 3 },
  ]);
});

test('delimiter at end', () => {
  expect(split('a\\b\\', '\\')).toStrictEqual([
    { part: 'a', offset: 0, tail: '\\' },
    { part: 'b', offset: 2, tail: '\\' },
    { part: '', offset: 4 },
  ]);
});

test('split by regex delimiter', () => {
  expect(split('a\nb\r\nc', /\r?\n/)).toStrictEqual([
    { part: 'a', offset: 0, tail: '\n' },
    { part: 'b', offset: 2, tail: '\r\n' },
    { part: 'c', offset: 5 },
  ]);
});

test('multi-char string delimiter', () => {
  expect(split('a!~b!~c', '!~')).toStrictEqual([
    { part: 'a', offset: 0, tail: '!~' },
    { part: 'b', offset: 3, tail: '!~' },
    { part: 'c', offset: 6 },
  ]);
});
