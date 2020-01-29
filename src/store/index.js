import Vue from 'vue';
import Vuex from 'vuex';

import editor from './editor';
import icon from './icon';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    editor,
    icon,
  },
});
