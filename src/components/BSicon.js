import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as iconActions from '../actions/icon';

@connect(mapStateToProps, mapDispatchToProps)
export default class BSicon extends Component {

  constructor(props) {
    super(props);
    props.get(props.icon);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.icon != nextProps.icon) {
      this.props.get(nextProps.icon);
    }
  }

  render() {
    const { get, icon, content, ...props } = this.props;
    return <img src={content} {...props} />;
  }

}

function mapStateToProps(store, props) {
  return {
    content: store.icons[props.icon],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    get: (icon) => dispatch(iconActions.get(icon)),
  }
}
