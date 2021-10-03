import { Module, MutationTree, ActionTree } from 'vuex';
import md5 from 'md5';

import { RootState, IconState } from './types';

const baseUrl = 'https://upload.wikimedia.org/wikipedia/commons';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

const state: IconState = {
  icons: {},
};

const mutations: MutationTree<IconState> = {
  fetching(state: IconState, { name }: { name: string }): void {
    state.icons = {
      ...state.icons,
      [name]: null,
    };
  },
  fetched(state: IconState, { name, data }: { name: string; data: string }): void {
    state.icons = {
      ...state.icons,
      [name]: { data, ratio: 1 },
    };
  },
  failed(state: IconState, { name }: { name: string }): void {
    state.icons = {
      ...state.icons,
      [name]: null,
    };
  },
  resolved(state: IconState, { name, ratio }: { name: string; ratio: number }): void {
    const icon = state.icons[name];
    if (!icon) return;
    state.icons = {
      ...state.icons,
      [name]: { ...icon, ratio },
    };
  },
};

const actions: ActionTree<IconState, RootState> = {
  async fetch({ commit, state }, name: string): Promise<void> {
    if (typeof state.icons[name] != 'undefined') {
      return;
    }

    commit('fetching', { name });

    try {
      const file = `BSicon_${name}.svg`;
      const hash = md5(file);

      const res = await fetch(`${baseUrl}/${hash.substring(0, 1)}/${hash.substring(0, 2)}/${file}`);
      if (res.status < 200 || res.status >= 300) {
        commit('failed', { name });
        return;
      }

      const data = URL.createObjectURL(await res.blob());
      commit('fetched', { name, data });

      const img = await loadImage(data);
      const ratio = img.width / img.height;
      commit('resolved', { name, ratio });
    } catch (e) {
      console.error(e);
      commit('failed', { name });
    }
  },
};

const icon: Module<IconState, RootState> = {
  state,
  mutations,
  actions,
};

export default icon;
