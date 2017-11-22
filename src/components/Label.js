import React, { Component } from 'react';
import { connect } from 'react-redux';

import demoActions from '../actions/demo';

import BSicon from './BSicon';

@connect(mapStateToProps, mapDispatchToProps)
export default class Label extends Component {

  render() {
    return (
      <div>
        {this.props.text.split('\\').map(icon => (
          <BSicon icon={icon} />
        ))}
      </div>
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
  }
}
