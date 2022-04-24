<template>
  <resizable v-model:width="width">
    <template v-slot:default>
      <editor v-model:content="content" v-model:selection="selection" v-model:scroll="scroll" :icons="iconStore.icons"
        :size="editorStore.size" :width="width" />
    </template>
    <template v-slot:fixed>
      <scroller v-model:scroll="scroll">
        <BSMap v-bind:content="content" v-bind:size="editorStore.size" v-bind:width="width" />
      </scroller>
    </template>
  </resizable>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useEditorStore } from '@/stores/editor';
import { useIconStore } from '@/stores/icon';
import ISelection from '@/types/selection';

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
    editorStore.setWidth(v);
  }
});

const scroll = computed({
  get(): number {
    return editorStore.scroll;
  },
  set(v: number) {
    editorStore.setScroll(v);
  }
});

const selection = computed({
  get(): ISelection | null {
    return editorStore.selection;
  },
  set(v: ISelection | null) {
    editorStore.setSelection(v);
  }
});

const content = computed({
  get(): string {
    return editorStore.content;
  },
  set(v: string) {
    editorStore.save(v);
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
