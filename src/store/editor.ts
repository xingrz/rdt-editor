import { Module, MutationTree } from 'vuex';
import throttle from 'lodash-es/throttle';

import { RootState, EditorState } from './types';
import ISelection from '@/types/selection';

const throttledSetItem = throttle(localStorage.setItem, 1000).bind(localStorage);

const state: EditorState = {
  size: parseInt(localStorage.getItem('size') || '') || 20,
  width: parseInt(localStorage.getItem('width') || '') || 200,
  content: localStorage.getItem('content') || '',
  scroll: 0,
  selection: null,
};

const mutations: MutationTree<EditorState> = {
  setSize(state: EditorState, size: number): void {
    state.size = size;
    throttledSetItem('size', `${size}`);
  },
  setWidth(state: EditorState, width: number): void {
    state.width = width;
    throttledSetItem('width', `${width}`);
  },
  setScroll(state: EditorState, scroll: number): void {
    state.scroll = scroll;
  },
  setSelection(state: EditorState, selection: ISelection | null): void {
    state.selection = selection;
  },
  save(state: EditorState, content: string): void {
    state.content = content;
    throttledSetItem('content', content);
  },
};

const editor: Module<EditorState, RootState> = {
  state,
  mutations,
};

export default editor;
