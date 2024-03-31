<template>
  <BSSelectable v-slot="{ selectable }" :row="props.row" :offset="props.offset" :length="props.src.length">
    <div :class="[selectable, $style.cell]" :title="props.src" @click="handleClick" :style="style">
      <BSIcon v-for="(icon, index) in (parts?.icons || [])" :key="index" :src="icon"
        @ratio="(ratio: number) => updateRatio(index, ratio)" />
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  computed,
  defineProps,
  ref,
} from 'vue';

import { useEditorStore } from '@/stores/editor';
import styleFromParams from '@/utils/styleFromParams';

import BSSelectable from './BSSelectable.vue';
import BSIcon from './BSIcon.vue';

const props = defineProps<{
  src: string;
  row: number;
  offset: number;
}>();

const editorStore = useEditorStore();

const ratio = ref(1);

const parts = computed(() => {
  if (!props.src) return;

  const [nonParam, ...params] = props.src.split('!_');
  const [nonLink, ...links] = nonParam.split('!@');
  const icons = nonLink.split('!~').filter((icon) => !!icon);

  return { icons, links, params };
});

const style = computed(() => ({
  ...styleFromParams(parts.value?.params?.[0], true),
  '--bs-map-cell-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

function handleClick(): void {
  editorStore.selection = {
    row: props.row,
    offset: props.offset,
    length: props.src.length,
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
