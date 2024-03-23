<template>
  <resizable v-model:width="width">
    <template v-slot:default>
      <editor v-model:content="editorStore.content" v-model:selection="editorStore.selection"
        v-model:scroll="editorStore.scroll" :icons="iconStore.icons" :size="editorStore.size" />
    </template>
    <template v-slot:fixed>
      <scroller v-model:scroll="editorStore.scroll">
        <BSMap :content="editorStore.content" :size="editorStore.size" />
      </scroller>
    </template>
  </resizable>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useEditorStore } from '@/stores/editor';
import { useIconStore } from '@/stores/icon';

import Resizable from './components/Resizable.vue';
import Scroller from './components/Scroller.vue';
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';

const editorStore = useEditorStore();
const iconStore = useIconStore();

const width = computed({
  get(): number {
    const max = window.innerWidth - 200;
    const min = 200;
    const width = editorStore.width;
    return Math.max(Math.min(width, max), min);
  },
  set(v: number) {
    editorStore.width = v;
  }
});
</script>

<style lang="scss" module>
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  overscroll-behavior-x: none;
}
</style>
