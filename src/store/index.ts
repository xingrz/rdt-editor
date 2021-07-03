import Vue from 'vue';
import Vuex, { Store, StoreOptions } from 'vuex';

Vue.use(Vuex);

import { RootState } from './types';

import editor from './editor';
import icon from './icon';

const store: StoreOptions<RootState> = {
  modules: {
    editor,
    icon,
  },
};

export default new Store<RootState>(store);
