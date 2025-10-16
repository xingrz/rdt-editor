import { expect, test } from 'vitest';
import { parseKeyword } from '@/ast';

test('keyword without args', () => {
  expect(parseKeyword('-test', 0)).toStrictEqual({
    kind: 'keyword',
    offset: 0,
    length: 5,
    src: '-test',
    func: 'test',
    args: [],
  });
});

test('keyword with args', () => {
  expect(parseKeyword('-test-arg1-arg2', 10)).toStrictEqual({
    kind: 'keyword',
    offset: 10,
    length: 15,
    src: '-test-arg1-arg2',
    func: 'test',
    args: ['arg1', 'arg2'],
  });
});

test('keyword with nothing', () => {
  expect(parseKeyword('-', 5)).toStrictEqual({
    kind: 'keyword',
    offset: 5,
    length: 1,
    src: '-',
    func: '',
    args: [],
  });
});
