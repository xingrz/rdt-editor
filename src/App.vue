<template>
  <n-config-provider>
    <n-split direction="horizontal" :resize-trigger-size="8" v-model:size="editorStore.split">
      <template #1>
        <editor v-model:content="editorStore.content" v-model:selection="editorStore.selection"
          v-model:scroll="editorStore.scroll" :icons="iconStore.icons" :size="editorStore.size" />
      </template>
      <template #2>
        <scroller v-model:scroll="editorStore.scroll">
          <BSMap :content="editorStore.content" :size="editorStore.size" />
        </scroller>
      </template>
      <template #resize-trigger>
        <div :class="$style.resizer">
        </div>
      </template>
    </n-split>
  </n-config-provider>
</template>

<script lang="ts" setup>
import {
  NConfigProvider,
  NSplit,
} from 'naive-ui';

import { useEditorStore } from '@/stores/editor';
import { useIconStore } from '@/stores/icon';

import Scroller from './components/Scroller.vue';
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';

const editorStore = useEditorStore();
const iconStore = useIconStore();
</script>

<style lang="scss" module>
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
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
