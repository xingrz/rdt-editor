import { Mode as TextMode } from 'ace-code/src/mode/text';
import { TextHighlightRules } from 'ace-code/src/mode/text_highlight_rules';

export class RDTHighlightRules extends TextHighlightRules {
  constructor() {
    super();
    this.normalizeRules();
  }

  $rules = {
    start: [
      {
        token: 'keyword.operator.rdt',
        regex: '(?:\\\\|!~)',
      },
      {
        token: 'punctuation.definition.string',
        regex: '(?:~~.*$)',
      },
      {
        token: 'keyword.control.statement.rdt',
        regex: '(?:[^\\\\(~~)(!~)]+)',
      },
    ],
  };
}

export class Mode extends TextMode {
  $id = 'ace/mode/rdt';
  HighlightRules = RDTHighlightRules;
}
