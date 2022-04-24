<template>
  <div id="app">
    <resizable v-model:width="width">
      <template v-slot:default>
        <editor v-model:content="content" v-model:selection="selection" v-model:scroll="scroll" :icons="icons"
          :size="editor.size" :width="width" />
      </template>
      <template v-slot:fixed>
        <scroller v-model:scroll="scroll">
          <BSMap v-bind:content="content" v-bind:size="editor.size" v-bind:width="width" />
        </scroller>
      </template>
    </Resizable>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useStore } from '@/store';
import ISelection from '@/types/selection';

import Resizable from './components/Resizable.vue';
import Scroller from './components/Scroller.vue';
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';

const store = useStore();
const editor = computed(() => store.state.editor);
const icons = computed(() => store.state.icon.icons);

const width = computed({
  get(): number {
    const max = window.innerWidth - 200;
    const min = 200;
    const width = store.state.editor.width;
    return Math.max(Math.min(width, max), min);
  },
  set(v: number) {
    store.commit('setWidth', v);
  }
});

const scroll = computed({
  get(): number {
    return store.state.editor.scroll;
  },
  set(v: number) {
    store.commit('setScroll', v);
  }
});

const selection = computed({
  get(): ISelection | null {
    return store.state.editor.selection;
  },
  set(v: ISelection | null) {
    store.commit('setSelection', v);
  }
});

const content = computed({
  get(): string {
    return store.state.editor.content;
  },
  set(v: string) {
    store.commit('save', v);
  }
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overscroll-behavior-x: none;
}
</style>
