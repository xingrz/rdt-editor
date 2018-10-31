import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import styles from './App.scss';

import Resizable from './Resizable';

import Editor from './Editor';
import BSMap from './BSMap';

import * as editorActions from '../actions/editor';

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {

  state = {
    width: 400,
  };

  componentDidMount() {
    document.addEventListener('mousewheel', this.handleTouchEvent, false);
    // document.addEventListener('touchmove', this.handleTouchEvent, { passive: false });
  }

  componentWillUnmount() {
    document.removeEventListener('mousewheel', this.handleTouchEvent);
    // document.removeEventListener('touchmove', this.handleTouchEvent);
  }

  handleTouchEvent = (evt) => {
    // if (evt.target == '')
    // evt.preventDefault();
    console.log('touch', evt);
  }

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
    this.props.save(value);
  }

  onCursorChange = (selection) => {
  };

  render() {
    const { text } = this.props;
    return (
      <Resizable width={this.state.width} onResize={this.onResize}>

        <Editor
          ref={ref => this.editor = ref}
          value={text}
          onChange={this.onChange}
          getCompletions={this.getCompletions}
          getDocTooltip={this.getDocTooltip}
          onCursorChange={this.onCursorChange}
        />

        <BSMap text={text} />

      </Resizable>
    );
  }

}

function mapStateToProps(store, props) {
  return {
    icons: store.icons,
    text: store.editor.text,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    save: (text) => dispatch(editorActions.save(text)),
  }
}
