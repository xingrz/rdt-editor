import { expect, test, vi } from 'vitest';
import { parseCell } from '@/ast';

test('simple cell without link or params', () => {
  const parseIcons = vi.fn().mockReturnValue([{ kind: 'icon', offset: 100, length: 111, name: 'mock-icon' }]);

  expect(parseCell('STR', 0, { parseIcons })).toStrictEqual({
    kind: 'cell',
    src: 'STR',
    offset: 0,
    length: 3,
    icons: [{ kind: 'icon', offset: 100, length: 111, name: 'mock-icon' }],
    link: undefined,
    params: undefined,
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('STR', 0);
});

test('cell with link only', () => {
  const parseIcons = vi.fn().mockReturnValue([
    { kind: 'icon', offset: 200, length: 222, name: 'link-icon' },
    { kind: 'text', offset: 300, length: 333, text: 'link-text', prefix: '' },
  ]);

  expect(parseCell('DEX!@LINK', 10, { parseIcons })).toStrictEqual({
    kind: 'cell',
    src: 'DEX!@LINK',
    offset: 10,
    length: 9,
    icons: [
      { kind: 'icon', offset: 200, length: 222, name: 'link-icon' },
      { kind: 'text', offset: 300, length: 333, text: 'link-text', prefix: '' },
    ],
    link: 'LINK',
    params: undefined,
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('DEX', 10);
});

test('cell with params only', () => {
  const parseIcons = vi.fn().mockReturnValue([{ kind: 'text', offset: 400, length: 444, text: 'param-text', prefix: 'pre' }]);
  const parseParams = vi.fn().mockReturnValue({ color: 'red', size: '2' });

  expect(parseCell('VIT!_color=red,size=2', 50, { parseIcons, parseParams })).toStrictEqual({
    kind: 'cell',
    src: 'VIT!_color=red,size=2',
    offset: 50,
    length: 21,
    icons: [{ kind: 'text', offset: 400, length: 444, text: 'param-text', prefix: 'pre' }],
    link: undefined,
    params: { color: 'red', size: '2' },
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('VIT', 50);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('color=red,size=2');
});

test('cell with both link and params', () => {
  const parseIcons = vi.fn().mockReturnValue([
    { kind: 'icon', offset: 500, length: 555, name: 'full-icon' },
    { kind: 'icon', offset: 600, length: 666, name: 'another-icon' },
  ]);
  const parseParams = vi.fn().mockReturnValue({ bg: 'blue', border: '1' });

  expect(parseCell('AGI!@LINK!_bg=blue,border=1', 100, { parseIcons, parseParams })).toStrictEqual({
    kind: 'cell',
    src: 'AGI!@LINK!_bg=blue,border=1',
    offset: 100,
    length: 27,
    icons: [
      { kind: 'icon', offset: 500, length: 555, name: 'full-icon' },
      { kind: 'icon', offset: 600, length: 666, name: 'another-icon' },
    ],
    link: 'LINK',
    params: { bg: 'blue', border: '1' },
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('AGI', 100);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('bg=blue,border=1');
});

test('empty cell', () => {
  const parseIcons = vi.fn().mockReturnValue([]);

  expect(parseCell('', 0, { parseIcons })).toStrictEqual({
    kind: 'cell',
    src: '',
    offset: 0,
    length: 0,
    icons: [],
    link: undefined,
    params: undefined,
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('', 0);
});

test('cell with empty link', () => {
  const parseIcons = vi.fn().mockReturnValue([{ kind: 'icon', offset: 700, length: 777, name: 'empty-link-icon' }]);

  expect(parseCell('STR!@', 20, { parseIcons })).toStrictEqual({
    kind: 'cell',
    src: 'STR!@',
    offset: 20,
    length: 5,
    icons: [{ kind: 'icon', offset: 700, length: 777, name: 'empty-link-icon' }],
    link: undefined,
    params: undefined,
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('STR!@', 20);
});

test('cell with empty params', () => {
  const parseIcons = vi.fn().mockReturnValue([{ kind: 'text', offset: 800, length: 888, text: 'empty-param', prefix: 'ep' }]);
  const parseParams = vi.fn().mockReturnValue({});

  expect(parseCell('DEX!_', 30, { parseIcons, parseParams })).toStrictEqual({
    kind: 'cell',
    src: 'DEX!_',
    offset: 30,
    length: 5,
    icons: [{ kind: 'text', offset: 800, length: 888, text: 'empty-param', prefix: 'ep' }],
    link: undefined,
    params: {},
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('DEX!_', 30);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith(undefined);
});

test('complex icons content', () => {
  const parseIcons = vi.fn().mockReturnValue([
    { kind: 'icon', offset: 900, length: 999, name: 'complex1' },
    { kind: 'text', offset: 1000, length: 1010, text: 'complex-text', prefix: 'cx' },
    { kind: 'icon', offset: 1100, length: 1111, name: 'complex2' },
  ]);
  const parseParams = vi.fn().mockReturnValue({ theme: 'dark', opacity: '0.8' });

  expect(parseCell('STR!~*Text!~DEX!_theme=dark,opacity=0.8', 0, { parseIcons, parseParams })).toStrictEqual({
    kind: 'cell',
    src: 'STR!~*Text!~DEX!_theme=dark,opacity=0.8',
    offset: 0,
    length: 39,
    icons: [
      { kind: 'icon', offset: 900, length: 999, name: 'complex1' },
      { kind: 'text', offset: 1000, length: 1010, text: 'complex-text', prefix: 'cx' },
      { kind: 'icon', offset: 1100, length: 1111, name: 'complex2' },
    ],
    link: undefined,
    params: { theme: 'dark', opacity: '0.8' },
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('STR!~*Text!~DEX', 0);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('theme=dark,opacity=0.8');
});

test('with different offset', () => {
  const parseIcons = vi.fn().mockReturnValue([{ kind: 'icon', offset: 1200, length: 1212, name: 'offset-icon' }]);
  const parseParams = vi.fn().mockReturnValue({ test: 'offset' });

  expect(parseCell('VIT!@link!_test=offset', 500, { parseIcons, parseParams })).toStrictEqual({
    kind: 'cell',
    src: 'VIT!@link!_test=offset',
    offset: 500,
    length: 22,
    icons: [{ kind: 'icon', offset: 1200, length: 1212, name: 'offset-icon' }],
    link: 'link',
    params: { test: 'offset' },
  });

  expect(parseIcons).toHaveBeenCalledOnce();
  expect(parseIcons).toHaveBeenCalledWith('VIT', 500);
  expect(parseParams).toHaveBeenCalledOnce();
  expect(parseParams).toHaveBeenCalledWith('test=offset');
});
