<template>
  <BSSelectable v-slot="{ selectable }" :row="props.row" :offset="props.offset" :length="props.content.length">
    <div :class="[selectable, $style.text]" :data-align="align" :title="content" @click="handleClick">{{ content }}
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import { useEditorStore } from '@/stores/editor';

import BSSelectable from './BSSelectable.vue';

const props = defineProps<{
  content: string;
  align: number;
  row: number;
  offset: number;
}>();

const editorStore = useEditorStore();

function handleClick(): void {
  editorStore.selection = {
    row: props.row,
    offset: props.offset,
    length: props.content.length,
    from: 'preview',
  };
}
</script>

<style lang="scss" module>
.text {
  user-select: none;
  cursor: pointer;
  margin: 0 5px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &[data-align="4"] {
    flex-grow: 1;
    text-align: end;
  }
}
</style>
