import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

import { RootState } from './types';

import editor from './editor';
import icon from './icon';

export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore<RootState>({
  modules: {
    editor,
    icon,
  },
});

export function useStore(): Store<RootState> {
  return baseUseStore(key);
}
