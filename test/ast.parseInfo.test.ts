import { expect, test } from 'vitest';
import { parseInfo } from '@/ast';

test('single item (total = 1) should appear in column 2', () => {
  expect(parseInfo('Hello World', 0, 0, 1)).toStrictEqual({
    kind: 'info',
    offset: 0,
    length: 11,
    text: 'Hello World',
    column: 2,
  });
});

test('first item of multiple (index = 0, total = 3)', () => {
  expect(parseInfo('First', 10, 0, 3)).toStrictEqual({
    kind: 'info',
    offset: 10,
    length: 5,
    text: 'First',
    column: 1,
  });
});

test('middle item of multiple (index = 1, total = 3)', () => {
  expect(parseInfo('Second', 20, 1, 3)).toStrictEqual({
    kind: 'info',
    offset: 20,
    length: 6,
    text: 'Second',
    column: 2,
  });
});

test('last item of multiple (index = 2, total = 3)', () => {
  expect(parseInfo('Third', 30, 2, 3)).toStrictEqual({
    kind: 'info',
    offset: 30,
    length: 5,
    text: 'Third',
    column: 3,
  });
});

test('empty text', () => {
  expect(parseInfo('', 0, 0, 1)).toStrictEqual({
    kind: 'info',
    offset: 0,
    length: 0,
    text: '',
    column: 2,
  });
});

test('text with spaces', () => {
  expect(parseInfo('  Hello World  ', 5, 1, 2)).toStrictEqual({
    kind: 'info',
    offset: 5,
    length: 15,
    text: 'Hello World',
    column: 2,
  });
});

test('with different offset', () => {
  expect(parseInfo('Test', 100, 0, 2)).toStrictEqual({
    kind: 'info',
    offset: 100,
    length: 4,
    text: 'Test',
    column: 1,
  });
});
