import { Mode as TextMode } from 'ace-code/src/mode/text';
import { TextHighlightRules } from 'ace-code/src/mode/text_highlight_rules';
import type { Ace } from 'ace-code';

export class RDTHighlightRules extends TextHighlightRules {
  constructor() {
    super();
    this.normalizeRules();
  }

  _basicRules: Ace.HighlightRule[] = [
    {
      token: 'text',
      regex: /\\/,
      next: 'start',
    },
    {
      token: 'keyword.operator',
      regex: /!@/,
      next: 'cellLink',
    },
    {
      token: 'keyword.operator',
      regex: /!~/,
      next: 'start',
    },
    {
      token: 'keyword.operator',
      regex: /(!_)|(__)/,
      next: 'cellParams',
    },
    {
      token: 'text',
      regex: /~~/,
      next: 'sideText',
    },
    {
      token: 'comment.block',
      regex: /<!--/,
      next: 'comment',
    },
  ];

  $rules = {
    start: [
      ...this._basicRules,
      {
        defaultToken: 'keyword.control',
      },
    ],
    cellLink: [
      ...this._basicRules,
      { defaultToken: 'constant.character' },
    ],
    cellParams: [
      ...this._basicRules,
      { defaultToken: 'string' },
    ],
    sideText: [
      {
        token: 'text',
        regex: /~~/,
      },
      {
        token: 'comment.block',
        regex: /<!--/,
        next: 'comment',
      },
      {
        regex: /$/,
        next: 'start',
      },
      { defaultToken: 'string' },
    ],
    comment: [
      {
        token: 'comment.block',
        regex: /-->/,
        next: 'start',
      },
      { defaultToken: 'comment.block' },
    ],
  };
}

export class Mode extends TextMode {
  $id = 'ace/mode/rdt';
  HighlightRules = RDTHighlightRules;
}
