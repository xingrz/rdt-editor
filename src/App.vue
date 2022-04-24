<template>
  <div id="app">
    <resizable v-model:width="width">
      <template v-slot:default>
        <Editor v-bind:size="editor.size" v-bind:scroll="editor.scroll" v-bind:width="width"
          v-bind:selection="editor.selection" />
      </template>
      <template v-slot:fixed>
        <scroller v-model:scroll="scroll">
          <BSMap v-bind:content="editor.content" v-bind:size="editor.size" v-bind:width="width" />
        </scroller>
      </template>
    </Resizable>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useStore } from '@/store';

import Resizable from './components/Resizable.vue';
import Scroller from './components/Scroller.vue';
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';

const store = useStore();
const editor = computed(() => store.state.editor);

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
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overscroll-behavior-x: none;
}
</style>
