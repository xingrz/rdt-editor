import React, { Component } from 'react';
import classnames from 'classnames';

import styles from './App.scss';

import Input from './Input';
import Label from './Label';

export default class App extends Component {

  render() {
    return (
      <div>Hello,
        <span className={classnames(styles.style1, styles.style2)}>world</span>

        <Input />
        <Label />
      </div>
    );
  }

}
