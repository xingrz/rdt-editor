<template>
  <div :class="$style.cell" :title="content" :style="{ width: `${size * ratio}px`, height: `${size}px` }"
    @click="handleClick">
    <BSIcon v-for="(icon, index) in icons" :key="index" :content="icon" :size="size" :index="index"
      @ratio="(ratio: number) => updateRatio(index, ratio)" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from 'vue';

import { useEditorStore } from '@/stores/editor';

import BSIcon from './BSIcon.vue';

const props = defineProps<{
  content: string;
  size: number;
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

function handleClick(): void {
  editorStore.setSelection({
    row: props.row,
    offset: props.offset,
    length: props.content.length,
    from: 'preview',
  });
}

function updateRatio(index: number, newRatio: number): void {
  if (index != 0) return;
  ratio.value = newRatio;
}
</script>

<style lang="scss" module>
.cell {
  position: relative;
  cursor: pointer;
}
</style>
