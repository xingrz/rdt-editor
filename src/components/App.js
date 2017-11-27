import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import styles from './App.scss';

import Resizable from './Resizable';
import Editor from './Editor';

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  state = {
    width: 400,
    value: '',
  };

  getCompletions = (editor, session, pos, prefix, callback) => {
    const { icons } = this.props;
    callback(null, Object.keys(icons)
      .filter(icon => !!icons[icon])
      .map(icon => ({ value: icon })));
  };

  getDocTooltip = (item) => {
    const { icons } = this.props;
    item.docHTML = `<img src="${icons[item.value]}" class="${styles.preview}" />`;
  };

  onResize = (width) => {
    this.setState({ width });
    this.editor.resize();
  };

  onChange = (value) => {
    this.setState({ value });
  }

  render() {
    return (
      <Resizable width={this.state.width} onResize={this.onResize}>

        <Editor
          className={styles.editor}
          ref={ref => this.editor = ref}
          value={this.state.value}
          onChange={this.onChange}
          getCompletions={this.getCompletions}
          getDocTooltip={this.getDocTooltip}
          // onSelectionChange={console.log.bind(console, 'onSelectionChange')}
          onCursorChange={console.log.bind(console, 'onCursorChange')}
        />

        <div className={styles.preview} />

      </Resizable>
    );
  }

}

function mapStateToProps(store, props) {
  return {
    icons: store.icons,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}
