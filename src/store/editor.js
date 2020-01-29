import throttle from 'lodash/throttle';

const throttledSetItem = throttle(localStorage.setItem, 1000).bind(localStorage);

export default {
  state: {
    size: parseInt(localStorage.getItem('size')) || 20,
    width: parseInt(localStorage.getItem('width')) || 200,
    content: localStorage.getItem('content') || '',
    scroll: 0,
  },
  mutations: {
    setSize(state, size) {
      state.size = size;
      throttledSetItem('size', size);
    },
    setWidth(state, width) {
      state.width = width;
      throttledSetItem('width', width);
    },
    setScroll(state, scroll) {
      state.scroll = scroll;
    },
    save(state, content) {
      state.content = content;
      throttledSetItem('content', content);
    },
  },
};
