import ace from 'brace';

ace.define('ace/mode/rdt_highlight_rules',
  ['require', 'exports', 'ace/mode/text_highlight_rules'],
  (acequire, exports) => {
    const { TextHighlightRules } = acequire('./text_highlight_rules');

    class RDTHighlightRules extends TextHighlightRules {

      static metaData = {
        name: 'RDT File',
        scopeName: 'source.rdt',
        fileTypes: [ 'rdt' ],
      };

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

      constructor() {
        super();
        this.normalizeRules();
      }

    }

    exports.RDTHighlightRules = RDTHighlightRules;
  });

ace.define('ace/mode/rdt',
  ['require', 'exports', 'ace/mode/text', 'ace/mode/rdt_highlight_rules'],
  (acequire, exports) => {
    const { Mode: TextMode } = acequire('./text');
    const { RDTHighlightRules } = acequire('./rdt_highlight_rules');

    class Mode extends TextMode {

      $id = 'ace/mode/rdt';
      HighlightRules = RDTHighlightRules;

    }

    exports.Mode = Mode;
  });
