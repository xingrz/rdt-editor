import { expect, test, vi } from 'vitest';
import { parseMap } from '@/ast';

test('simple map with single row', () => {
  const parseRows = vi.fn().mockReturnValue([
    {
      kind: 'row',
      offset: 100,
      length: 111,
      src: 'mock-row',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'mock-cell', offset: 200, length: 222, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
  ]);

  expect(parseMap('STR\\DEX', { parseRows })).toStrictEqual({
    rows: [
      {
        kind: 'row',
        offset: 100,
        length: 111,
        src: 'mock-row',
        lInfo: [],
        rInfo: [],
        cells: [{ kind: 'cell', src: 'mock-cell', offset: 200, length: 222, icons: [], link: undefined, params: undefined }],
        params: undefined,
      },
    ],
  });

  expect(parseRows).toHaveBeenCalledOnce();
  expect(parseRows).toHaveBeenCalledWith('STR\\DEX');
});

test('map with multiple rows', () => {
  const parseRows = vi.fn().mockReturnValue([
    {
      kind: 'row',
      offset: 1000,
      length: 1111,
      src: 'first-mock-row',
      lInfo: [{ kind: 'info', offset: 1200, length: 1222, text: 'first-left', column: 1 }],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 2000,
      length: 2222,
      src: 'second-mock-row',
      lInfo: [],
      rInfo: [{ kind: 'info', offset: 2200, length: 2333, text: 'second-right', column: 1 }],
      cells: [{ kind: 'cell', src: 'second-cell', offset: 2400, length: 2444, icons: [], link: undefined, params: undefined }],
      params: { color: 'blue' },
    },
    {
      kind: 'row',
      offset: 3000,
      length: 3333,
      src: 'third-mock-row',
      lInfo: [
        { kind: 'info', offset: 3100, length: 3111, text: 'third-left-1', column: 1 },
        { kind: 'info', offset: 3200, length: 3222, text: 'third-left-2', column: 2 }
      ],
      rInfo: [
        { kind: 'info', offset: 3300, length: 3333, text: 'third-right-1', column: 1 }
      ],
      cells: [
        { kind: 'cell', src: 'third-cell-1', offset: 3400, length: 3444, icons: [], link: 'link1', params: { cell: 'param1' } },
        { kind: 'cell', src: 'third-cell-2', offset: 3500, length: 3555, icons: [], link: undefined, params: undefined }
      ],
      params: undefined,
    },
  ]);

  expect(parseMap('Row1\nRow2\nRow3', { parseRows })).toStrictEqual({
    rows: [
      {
        kind: 'row',
        offset: 1000,
        length: 1111,
        src: 'first-mock-row',
        lInfo: [{ kind: 'info', offset: 1200, length: 1222, text: 'first-left', column: 1 }],
        rInfo: [],
        cells: [],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 2000,
        length: 2222,
        src: 'second-mock-row',
        lInfo: [],
        rInfo: [{ kind: 'info', offset: 2200, length: 2333, text: 'second-right', column: 1 }],
        cells: [{ kind: 'cell', src: 'second-cell', offset: 2400, length: 2444, icons: [], link: undefined, params: undefined }],
        params: { color: 'blue' },
      },
      {
        kind: 'row',
        offset: 3000,
        length: 3333,
        src: 'third-mock-row',
        lInfo: [
          { kind: 'info', offset: 3100, length: 3111, text: 'third-left-1', column: 1 },
          { kind: 'info', offset: 3200, length: 3222, text: 'third-left-2', column: 2 }
        ],
        rInfo: [
          { kind: 'info', offset: 3300, length: 3333, text: 'third-right-1', column: 1 }
        ],
        cells: [
          { kind: 'cell', src: 'third-cell-1', offset: 3400, length: 3444, icons: [], link: 'link1', params: { cell: 'param1' } },
          { kind: 'cell', src: 'third-cell-2', offset: 3500, length: 3555, icons: [], link: undefined, params: undefined }
        ],
        params: undefined,
      },
    ],
  });

  expect(parseRows).toHaveBeenCalledOnce();
  expect(parseRows).toHaveBeenCalledWith('Row1\nRow2\nRow3');
});

test('empty map', () => {
  const parseRows = vi.fn().mockReturnValue([
    {
      kind: 'row',
      offset: 4000,
      length: 4444,
      src: 'empty-mock-row',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
  ]);

  expect(parseMap('', { parseRows })).toStrictEqual({
    rows: [
      {
        kind: 'row',
        offset: 4000,
        length: 4444,
        src: 'empty-mock-row',
        lInfo: [],
        rInfo: [],
        cells: [],
        params: undefined,
      },
    ],
  });

  expect(parseRows).toHaveBeenCalledOnce();
  expect(parseRows).toHaveBeenCalledWith('');
});

test('map with empty rows', () => {
  const parseRows = vi.fn().mockReturnValue([
    {
      kind: 'row',
      offset: 5000,
      length: 5555,
      src: 'empty-row-1',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 6000,
      length: 6666,
      src: 'empty-row-2',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 7000,
      length: 7777,
      src: 'empty-row-3',
      lInfo: [],
      rInfo: [],
      cells: [],
      params: undefined,
    },
  ]);

  expect(parseMap('\n\n', { parseRows })).toStrictEqual({
    rows: [
      {
        kind: 'row',
        offset: 5000,
        length: 5555,
        src: 'empty-row-1',
        lInfo: [],
        rInfo: [],
        cells: [],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 6000,
        length: 6666,
        src: 'empty-row-2',
        lInfo: [],
        rInfo: [],
        cells: [],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 7000,
        length: 7777,
        src: 'empty-row-3',
        lInfo: [],
        rInfo: [],
        cells: [],
        params: undefined,
      },
    ],
  });

  expect(parseRows).toHaveBeenCalledOnce();
  expect(parseRows).toHaveBeenCalledWith('\n\n');
});

test('complex map with various row types', () => {
  const parseRows = vi.fn().mockReturnValue([
    {
      kind: 'row',
      offset: 8000,
      length: 8888,
      src: 'info-only-row',
      lInfo: [
        { kind: 'info', offset: 8100, length: 8111, text: 'left-info-1', column: 1 },
        { kind: 'info', offset: 8200, length: 8222, text: 'left-info-2', column: 2 }
      ],
      rInfo: [
        { kind: 'info', offset: 8300, length: 8333, text: 'right-info-1', column: 1 }
      ],
      cells: [],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 9000,
      length: 9999,
      src: 'cells-only-row',
      lInfo: [],
      rInfo: [],
      cells: [
        { kind: 'cell', src: 'cell-1', offset: 9100, length: 9111, icons: [{ kind: 'icon', offset: 9200, length: 9222, name: 'icon1' }], link: undefined, params: undefined },
        { kind: 'cell', src: 'cell-2', offset: 9300, length: 9333, icons: [{ kind: 'text', offset: 9400, length: 9444, text: 'text1', prefix: 'prefix1' }], link: 'link1', params: { cell2: 'param' } }
      ],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 1010,
      length: 1212,
      src: 'full-featured-row',
      lInfo: [
        { kind: 'info', offset: 1100, length: 1111, text: 'full-left', column: 1 }
      ],
      rInfo: [
        { kind: 'info', offset: 1200, length: 1222, text: 'full-right-1', column: 1 },
        { kind: 'info', offset: 1300, length: 1333, text: 'full-right-2', column: 2 },
        { kind: 'info', offset: 1400, length: 1444, text: 'full-right-3', column: 3 },
        { kind: 'info', offset: 1500, length: 1555, text: 'full-right-4', column: 4 }
      ],
      cells: [
        { kind: 'cell', src: 'full-cell', offset: 1600, length: 1666, icons: [], link: 'full-link', params: { full: 'cell-param' } }
      ],
      params: { row: 'full-param' },
    },
  ]);

  expect(parseMap('L1~~L2! !~~R1\nSTR!~*Text~~DEX!@link1!_cell2=param\nFL! !VIT!@full-link!_full=cell-param~~FR1~~FR2~~FR3~~FR4~~row=full-param', { parseRows })).toStrictEqual({
    rows: [
      {
        kind: 'row',
        offset: 8000,
        length: 8888,
        src: 'info-only-row',
        lInfo: [
          { kind: 'info', offset: 8100, length: 8111, text: 'left-info-1', column: 1 },
          { kind: 'info', offset: 8200, length: 8222, text: 'left-info-2', column: 2 }
        ],
        rInfo: [
          { kind: 'info', offset: 8300, length: 8333, text: 'right-info-1', column: 1 }
        ],
        cells: [],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 9000,
        length: 9999,
        src: 'cells-only-row',
        lInfo: [],
        rInfo: [],
        cells: [
          { kind: 'cell', src: 'cell-1', offset: 9100, length: 9111, icons: [{ kind: 'icon', offset: 9200, length: 9222, name: 'icon1' }], link: undefined, params: undefined },
          { kind: 'cell', src: 'cell-2', offset: 9300, length: 9333, icons: [{ kind: 'text', offset: 9400, length: 9444, text: 'text1', prefix: 'prefix1' }], link: 'link1', params: { cell2: 'param' } }
        ],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 1010,
        length: 1212,
        src: 'full-featured-row',
        lInfo: [
          { kind: 'info', offset: 1100, length: 1111, text: 'full-left', column: 1 }
        ],
        rInfo: [
          { kind: 'info', offset: 1200, length: 1222, text: 'full-right-1', column: 1 },
          { kind: 'info', offset: 1300, length: 1333, text: 'full-right-2', column: 2 },
          { kind: 'info', offset: 1400, length: 1444, text: 'full-right-3', column: 3 },
          { kind: 'info', offset: 1500, length: 1555, text: 'full-right-4', column: 4 }
        ],
        cells: [
          { kind: 'cell', src: 'full-cell', offset: 1600, length: 1666, icons: [], link: 'full-link', params: { full: 'cell-param' } }
        ],
        params: { row: 'full-param' },
      },
    ],
  });

  expect(parseRows).toHaveBeenCalledOnce();
  expect(parseRows).toHaveBeenCalledWith('L1~~L2! !~~R1\nSTR!~*Text~~DEX!@link1!_cell2=param\nFL! !VIT!@full-link!_full=cell-param~~FR1~~FR2~~FR3~~FR4~~row=full-param');
});

test('map with mixed newlines', () => {
  const parseRows = vi.fn().mockReturnValue([
    {
      kind: 'row',
      offset: 2020,
      length: 2323,
      src: 'mixed-row-1',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'mixed-cell-1', offset: 2100, length: 2111, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 3030,
      length: 3434,
      src: 'mixed-row-2',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'mixed-cell-2', offset: 3100, length: 3111, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
    {
      kind: 'row',
      offset: 4040,
      length: 4545,
      src: 'mixed-row-3',
      lInfo: [],
      rInfo: [],
      cells: [{ kind: 'cell', src: 'mixed-cell-3', offset: 4100, length: 4111, icons: [], link: undefined, params: undefined }],
      params: undefined,
    },
  ]);

  expect(parseMap('Row1\r\nRow2\nRow3', { parseRows })).toStrictEqual({
    rows: [
      {
        kind: 'row',
        offset: 2020,
        length: 2323,
        src: 'mixed-row-1',
        lInfo: [],
        rInfo: [],
        cells: [{ kind: 'cell', src: 'mixed-cell-1', offset: 2100, length: 2111, icons: [], link: undefined, params: undefined }],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 3030,
        length: 3434,
        src: 'mixed-row-2',
        lInfo: [],
        rInfo: [],
        cells: [{ kind: 'cell', src: 'mixed-cell-2', offset: 3100, length: 3111, icons: [], link: undefined, params: undefined }],
        params: undefined,
      },
      {
        kind: 'row',
        offset: 4040,
        length: 4545,
        src: 'mixed-row-3',
        lInfo: [],
        rInfo: [],
        cells: [{ kind: 'cell', src: 'mixed-cell-3', offset: 4100, length: 4111, icons: [], link: undefined, params: undefined }],
        params: undefined,
      },
    ],
  });

  expect(parseRows).toHaveBeenCalledOnce();
  expect(parseRows).toHaveBeenCalledWith('Row1\r\nRow2\nRow3');
});
