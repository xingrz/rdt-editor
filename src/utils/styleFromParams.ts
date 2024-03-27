import { parse } from 'qs';
import type { CSSProperties } from 'vue';

const YES = ['1', 'yes', 'y', 'true'];
const LEFT = ['l', 'left'];
const RIGHT = ['r', 'right'];
const TOP = ['a', 't', 'top'];
const BOTTOM = ['e', 'b', 'bottom'];
const TOP_LEFT = ['la', 'tl', 'c4', 'nw', 'top-left', 'topleft'];
const TOP_RIGHT = ['ra', 'tr', 'c1', 'ne', 'top-right', 'topright'];
const BOTTOM_LEFT = ['le', 'bl', 'c3', 'sw', 'bottom-left', 'bottomleft'];
const BOTTOM_RIGHT = ['re', 'br', 'c2', 'se', 'bottom-right', 'bottomright'];
const CENTER = ['c', 'center', 'centre'];
const MIDDLE = ['m', 'middle'];
const TOP_CENTER = ['ma', 'tc', 'top-center', 'top-centre', 'topcenter', 'topcentre'];
const BOTTOM_CENTER = ['me', 'bc', 'bottom-center', 'bottom-centre', 'bottomcenter', 'bottomcentre'];
const MIDDLE_LEFT = ['lm', 'ml', 'middle-left', 'middleleft'];
const MIDDLE_RIGHT = ['rm', 'mr', 'middle-right', 'middleright'];
const MIDDLE_CENTER = ['mc', 'cm', 'middle-center', 'middle-centre', 'middlecenter', 'middlecentre'];

export default function styleFromParams(text: string | undefined, inCell = false): CSSProperties {
  const style = {} as CSSProperties;
  const params = parse(text ?? '', { delimiter: ',' }) as Record<string, string>;

  if (params.bg) {
    style.backgroundColor = params.bg;
  } else if (params.background) {
    style.backgroundColor = params.background;
  } else if (params.bgcolor) {
    style.backgroundColor = params.bgcolor;
  }

  if (params.color) {
    style.color = params.color;
  } else if (params.colour) {
    style.color = params.colour;
  }

  if (YES.includes(params.b ?? params.bold)) {
    style.fontWeight = 'bold';
  }

  if (YES.includes(params.i ?? params.it ?? params.italic)) {
    style.fontStyle = 'italic';
  }

  if ([...LEFT, ...TOP_LEFT, ...BOTTOM_LEFT].includes(params.align)) {
    style['--bs-map-cell-halign'] = 'left';
  } else if ([...RIGHT, ...TOP_RIGHT, ...BOTTOM_RIGHT].includes(params.align)) {
    style['--bs-map-cell-halign'] = 'right';
  }

  if ([...TOP_LEFT, ...TOP_RIGHT].includes(params.align)) {
    style['--bs-map-cell-valign'] = 'top';
  } else if ([...BOTTOM_LEFT, ...BOTTOM_RIGHT].includes(params.align)) {
    style['--bs-map-cell-valign'] = 'bottom';
  }

  if (inCell) {
    if ([...TOP, ...TOP_CENTER].includes(params.align)) {
      style['--bs-map-cell-valign'] = 'top';
    } else if ([...BOTTOM, ...BOTTOM_CENTER].includes(params.align)) {
      style['--bs-map-cell-valign'] = 'bottom';
    } else if ([...MIDDLE, ...MIDDLE_LEFT, ...MIDDLE_RIGHT, ...MIDDLE_CENTER].includes(params.align)) {
      style['--bs-map-cell-valign'] = 'middle';
    }

    if (MIDDLE_LEFT.includes(params.align)) {
      style['--bs-map-cell-halign'] = 'left';
    } else if (MIDDLE_RIGHT.includes(params.align)) {
      style['--bs-map-cell-halign'] = 'right';
    } else if ([...CENTER, ...TOP_CENTER, ...BOTTOM_CENTER, ...MIDDLE_CENTER].includes(params.align)) {
      style['--bs-map-cell-halign'] = 'center';
    }
  }

  return style;
}
