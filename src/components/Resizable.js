import React, { Component } from 'react';
import classnames from 'classnames';

import styles from './Resizable.scss';

export default class Resizable extends Component {

  componentDidMount() {
    document.addEventListener('mousedown', this.onResizeStart, false);
    document.addEventListener('mousemove', this.onResizeMove, false);
    document.addEventListener('mouseup', this.onResizeEnd, false);
  }

  componentWillUmount() {
    document.removeEventListener('mousedown', this.onResizeStart);
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
  }

  onResizeStart = (evt) => {
    const { onResizeStart } = this.props;
    if (evt.target && evt.target.className == styles.resizer) {
      this.resizing = true;
      this.clientX = evt.clientX;
      this.width = this.props.width;
      if (typeof onResizeStart == 'function') {
        onResizeStart();
      }
    }
  };

  onResizeMove = (evt) => {
    const { onResize } = this.props;
    if (this.resizing && typeof onResize == 'function') {
      onResize(this.width - (evt.clientX - this.clientX));
    }
  };

  onResizeEnd = (evt) => {
    const { onResizeEnd } = this.props;
    this.resizing = false;
    if (typeof onResizeEnd == 'function') {
      onResizeEnd();
    }
  };

  render() {
    const { children, width, onResize, ...others } = this.props;
    return (
      <div className={styles.container} {...others}>
        <div className={styles.main}>
          {children[0]}
        </div>
        <div className={styles.resizer} />
        <div style={{ flexBasis: width }}>
          {children[1]}
        </div>
      </div>
    );
  }

}
