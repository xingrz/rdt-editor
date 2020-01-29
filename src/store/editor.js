export default {
  state: {
    width: parseInt(localStorage.getItem('width')) || 200,
    content: localStorage.getItem('content') || '',
  },
  mutations: {
    resize(state, width) {
      state.width = width;
      localStorage.setItem('width', width);
    },
    save(state, content) {
      state.content = content;
      localStorage.setItem('content', content);
    },
  },
};
