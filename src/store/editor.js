export default {
  state: {
    width: parseInt(localStorage.getItem('width')) || 200,
  },
  mutations: {
    resize(state, width) {
      state.width = width;
      localStorage.setItem('width', width);
    },
  },
};
