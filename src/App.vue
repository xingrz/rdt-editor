<template>
  <n-config-provider>
    <div :class="$style.container">
      <n-split :class="$style.main" direction="horizontal" :resize-trigger-size="8" v-model:size="width">
        <template #1>
          <code-editor v-model:content="editorStore.content" v-model:selection="editorStore.selection"
            v-model:scroll="editorStore.scroll" :icons="iconStore.icons" :size="editorStore.size" />
        </template>
        <template #2>
          <scroll-container v-model:scroll="editorStore.scroll">
            <BSMap :map="ast" :size="editorStore.size" />
          </scroll-container>
        </template>
        <template #resize-trigger>
          <div :class="$style.resizer" />
        </template>
      </n-split>
      <app-bar>
        <template #1>
          <size-setter />
        </template>
        <template #2>
          <cursor-position :map="ast" />
        </template>
        <template #3>
          <icon-status />
          <help-menu />
        </template>
      </app-bar>
    </div>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { computed, toRef } from 'vue';
import { refDebounced, useWindowSize } from '@vueuse/core';
import {
  NConfigProvider,
  NSplit,
} from 'naive-ui';

import { parseMap } from '@/ast';
import { useEditorStore } from '@/stores/editor';
import { useIconStore } from '@/stores/icon';

import ScrollContainer from './components/ScrollContainer.vue';
import BSMap from './components/BSMap.vue';
import CodeEditor from './components/CodeEditor.vue';
import AppBar from './components/AppBar.vue';

import SizeSetter from './components/AppBar/SizeSetter.vue';
import CursorPosition from './components/AppBar/CursorPosition.vue';
import IconStatus from './components/AppBar/IconStatus.vue';
import HelpMenu from './components/AppBar/HelpMenu.vue';

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

const debouncedContent = refDebounced(toRef(editorStore, 'content'), 100);
const ast = computed(() => parseMap(debouncedContent.value));
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
