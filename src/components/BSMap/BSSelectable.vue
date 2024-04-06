<template>
  <slot :selectable="{
    [$style.selectable]: true,
    [$style.focused]: focused,
  }" />
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import { useEditorStore } from '@/stores/editor';

const props = defineProps<{
  row: number;
  offset: number;
  length: number;
}>();

const editorStore = useEditorStore();

const focused = computed(() => {
  const { selection } = editorStore;
  return (
    typeof selection != 'undefined' &&
    selection.row == props.row &&
    selection.offset >= props.offset &&
    selection.offset <= props.offset + props.length
  );
});
</script>

<style lang="scss" module>
.selectable {
  position: relative;
  user-select: none;
  cursor: pointer;

  &::after {
    display: block;
    content: "";

    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background: #0099ff;
    opacity: 0;

    transition: opacity 200ms;
  }

  &:hover::after {
    opacity: 0.2;
  }

  &.focused::after {
    opacity: 0.3;
  }
}
</style>
