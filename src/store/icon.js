import md5 from 'md5';

const baseUrl = 'https://upload.wikimedia.org/wikipedia/commons';

export default {
  state: {
    data: {},
  },
  mutations: {
    fetching(state, { name }) {
      state.data = { ...state.data, [name]: null };
    },
    fetched(state, { name, data }) {
      state.data = { ...state.data, [name]: data };
    },
    failed(state, { name }) {
      state.data = { ...state.data, [name]: null };
    },
  },
  actions: {
    async fetch({ commit, state }, name) {
      if (typeof state.data[name] != 'undefined') {
        return;
      }

      commit('fetching', { name });

      try {
        const file = `BSicon_${name}.svg`;
        const hash = md5(file);

        const res = await fetch(`${baseUrl}/${hash.substring(0, 1)}/${hash.substring(0, 2)}/${file}`);
        if (res.status >= 200 && res.status < 300) {
          const svg = await res.text();
          const data = `data:image/svg+xml;base64,${btoa(svg)}`;
          commit('fetched', { name, data });
        } else {
          commit('failed', { name });
        }
      } catch (e) {
        console.error(e.stack);
        commit('failed', { name });
      }
    },
  },
};
