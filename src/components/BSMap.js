import React, { Component } from 'react';

import styles from './BSMap.scss';

import BSIcon from './BSIcon';

export default class BSMap extends Component {

  render() {
    const { text } = this.props;
    return (
      <div className={styles.map}>
        {text.split('\n').map(line => (
          <div className={styles.row}>
            {line ? line.split('\\').map(icon => (
              <BSIcon className={styles.icon} icon={icon} />
            )) : null}
          </div>
        ))}
      </div>
    );
  }

}
