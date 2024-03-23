<template>
  <div :class="$style.cell" :title="content" @click="handleClick" :style="style">
    <BSIcon v-for="(icon, index) in icons" :key="index" :content="icon" :index="index"
      @ratio="(ratio: number) => updateRatio(index, ratio)" />
  </div>
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  computed,
  defineProps,
  ref,
} from 'vue';

import { useEditorStore } from '@/stores/editor';

import BSIcon from './BSIcon.vue';

const props = defineProps<{
  content: string;
  row: number;
  offset: number;
}>();

const editorStore = useEditorStore();

const ratio = ref(1);

const icons = computed(() => {
  if (!props.content) return [];
  return props.content
    .split('!~')
    .map((icon) => icon.trim())
    .filter((icon) => !!icon);
});

const style = computed(() => ({
  '--bs-map-cell-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

function handleClick(): void {
  editorStore.selection = {
    row: props.row,
    offset: props.offset,
    length: props.content.length,
    from: 'preview',
  };
}

function updateRatio(layer: number, newRatio: number): void {
  if (layer == 0) {
    // Only ratio of the first icon affects the cell
    ratio.value = newRatio;
  }
}
</script>

<style lang="scss" module>
.cell {
  position: relative;
  cursor: pointer;
  width: calc(var(--bs-map-size) * var(--bs-map-cell-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
}
</style>
