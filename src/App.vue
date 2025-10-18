<template>
  <n-config-provider>
    <div :class="$style.container">
      <n-split :class="$style.main" direction="horizontal" :resize-trigger-size="8" v-model:size="width">
        <template #1>
          <editor v-model:content="editorStore.content" v-model:selection="editorStore.selection"
            v-model:scroll="editorStore.scroll" :icons="iconStore.icons" :size="editorStore.size" />
        </template>
        <template #2>
          <scroller v-model:scroll="editorStore.scroll">
            <BSMap :map="ast" :size="editorStore.size" />
          </scroller>
        </template>
        <template #resize-trigger>
          <div :class="$style.resizer" />
        </template>
      </n-split>
      <app-bar />
    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import {
  NConfigProvider,
  NSplit,
} from 'naive-ui';

import { parseMap } from '@/ast';
import { useEditorStore } from '@/stores/editor';
import { useIconStore } from '@/stores/icon';

import Scroller from './components/Scroller.vue';
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';
import AppBar from './components/AppBar.vue';

const editorStore = useEditorStore();
const iconStore = useIconStore();

const { width: windowWidth } = useWindowSize();
function clampWithWindowSize(value: number): number {
  const max = windowWidth.value - 200;
  const min = 200;
  return Math.max(Math.min(value, max), min);
}
const width = computed({
  get(): string {
    return `${clampWithWindowSize(windowWidth.value - editorStore.width)}px`;
  },
  set(v: string) {
    editorStore.width = clampWithWindowSize(windowWidth.value - parseInt(v));
  }
});

const ast = computed(() => parseMap(editorStore.content));
</script>

<style lang="scss" module>
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  flex: 1 1 auto;
  min-height: 0;
}

.resizer {
  height: 100%;
  background: #cccccc;

  transition: background-color 200ms;

  &:hover {
    background: #d5d5d5;
  }

  &:active {
    background: #c0c0c0;
  }
}
</style>
