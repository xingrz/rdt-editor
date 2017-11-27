import React, { Component } from 'react';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/theme/tomorrow';

import AceEditor from 'react-ace';

import styles from './Editor.scss';

export default class Editor extends Component {

  resize() {
    this.ace.editor.resize();
  }

  render() {
    const { getCompletions, getDocTooltip, ...others } = this.props;
    return (
      <AceEditor
        ref={ref => this.ace = ref}
        theme="tomorrow"
        fontSize={14}
        setOptions={{
          enableLiveAutocompletion: [
            { getCompletions, getDocTooltip },
          ],
        }}
        editorProps={{ $blockScrolling: true }}
        style={{
          width: '100%',
          height: '100vh',
        }}
        {...others}
      />
    );
  }

}
