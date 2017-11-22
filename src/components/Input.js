import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as demoActions from '../actions/demo';

@connect(mapStateToProps, mapDispatchToProps)
export default class Input extends Component {

  render() {
    return (
      <input
        type="text"
        value={this.props.text}
        onChange={({ target }) => this.props.showText(target.value)}
      />
    );
  }

}

function mapStateToProps(store, props) {
  return {
    text: store.demo.text,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showText: (text) => dispatch(demoActions.showText(text)),
  }
}
