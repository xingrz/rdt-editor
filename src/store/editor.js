import throttle from 'lodash/throttle';

const throttledSetItem = throttle(localStorage.setItem, 1000).bind(localStorage);

export default {
  state: {
    width: parseInt(localStorage.getItem('width')) || 200,
    content: localStorage.getItem('content') || '',
  },
  mutations: {
    resize(state, width) {
      state.width = width;
      throttledSetItem('width', width);
    },
    save(state, content) {
      state.content = content;
      throttledSetItem('content', content);
    },
  },
};
