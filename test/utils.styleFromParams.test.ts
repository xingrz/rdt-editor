import { expect, test } from 'vitest';
import styleFromParams from '@/utils/styleFromParams';

test('empty params returns empty style', () => {
  expect(styleFromParams({})).toStrictEqual({});
});

test('undefined params returns empty style', () => {
  expect(styleFromParams()).toStrictEqual({});
});

test('background color with bg', () => {
  expect(styleFromParams({ bg: '#ff0000' })).toMatchObject({
    backgroundColor: '#ff0000',
  });
});

test('background color with background', () => {
  expect(styleFromParams({ background: 'blue' })).toMatchObject({
    backgroundColor: 'blue',
  });
});

test('background color with bgcolor', () => {
  expect(styleFromParams({ bgcolor: 'green' })).toMatchObject({
    backgroundColor: 'green',
  });
});

test('bg takes priority over background', () => {
  expect(styleFromParams({ bg: 'red', background: 'blue' })).toMatchObject({
    backgroundColor: 'red',
  });
});

test('text color', () => {
  expect(styleFromParams({ color: 'red' })).toMatchObject({
    color: 'red',
  });
});

test('text colour (British spelling)', () => {
  expect(styleFromParams({ colour: 'blue' })).toMatchObject({
    color: 'blue',
  });
});

test('bold with b=1', () => {
  expect(styleFromParams({ b: '1' })).toMatchObject({
    fontWeight: 'bold',
  });
});

test('bold with bold=yes', () => {
  expect(styleFromParams({ bold: 'yes' })).toMatchObject({
    fontWeight: 'bold',
  });
});

test('italic with i=true', () => {
  expect(styleFromParams({ i: 'true' })).toMatchObject({
    fontStyle: 'italic',
  });
});

test('italic with italic=y', () => {
  expect(styleFromParams({ italic: 'y' })).toMatchObject({
    fontStyle: 'italic',
  });
});

test('align left', () => {
  const style = styleFromParams({ align: 'left' });
  expect(style['--bs-map-cell-halign']).toBe('left');
});

test('align right', () => {
  const style = styleFromParams({ align: 'right' });
  expect(style['--bs-map-cell-halign']).toBe('right');
});

test('align top-left sets both axes', () => {
  const style = styleFromParams({ align: 'top-left' });
  expect(style['--bs-map-cell-halign']).toBe('left');
  expect(style['--bs-map-cell-valign']).toBe('top');
});

test('align center only applies in cell', () => {
  const outside = styleFromParams({ align: 'center' });
  expect(outside['--bs-map-cell-halign']).toBeUndefined();

  const inside = styleFromParams({ align: 'center' }, true);
  expect(inside['--bs-map-cell-halign']).toBe('center');
});

test('align middle only applies in cell', () => {
  const outside = styleFromParams({ align: 'middle' });
  expect(outside['--bs-map-cell-valign']).toBeUndefined();

  const inside = styleFromParams({ align: 'middle' }, true);
  expect(inside['--bs-map-cell-valign']).toBe('middle');
});

test('align top only applies in cell', () => {
  const outside = styleFromParams({ align: 'top' });
  expect(outside['--bs-map-cell-valign']).toBeUndefined();

  const inside = styleFromParams({ align: 'top' }, true);
  expect(inside['--bs-map-cell-valign']).toBe('top');
});
