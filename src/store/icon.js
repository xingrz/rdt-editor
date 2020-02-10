import md5 from 'md5';

const baseUrl = 'https://upload.wikimedia.org/wikipedia/commons';

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export default {
  state: {
    data: {},
    ratio: {},
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
    resolved(state, { name, ratio }) {
      state.ratio = { ...state.ratio, [name]: ratio };
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
          const data = URL.createObjectURL(await res.blob());
          commit('fetched', { name, data });

          const img = await loadImage(data);
          const ratio = img.width / img.height;
          commit('resolved', { name, ratio });
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
