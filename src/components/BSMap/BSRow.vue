<template>
  <div :class="$style.row">
    <div :class="$style.cells" :style="{ flexBasis: `${iconWidth}px` }">
      <BSCell v-for="({ cell, offset }, index) in cells" :key="index"
        :class="{ [$style.selection]: true, [$style.focused]: isFocused(row, offset, cell.length) }" :content="cell"
        :size="size" :row="row" :offset="offset" />
    </div>
    <div :class="$style.texts" :style="{ maxWidth: `${textMaxWidth}px` }">
      <BSText v-for="({ text, offset, align }, index) in texts" :key="index"
        :class="{ [$style.selection]: true, [$style.focused]: isFocused(row, offset, text.length) }" :content="text"
        :align="align" :row="row" :offset="offset" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import { useEditorStore } from '@/stores/editor';

import BSCell from './BSCell.vue';
import BSText from './BSText.vue';

const props = defineProps<{
  content: string;
  cols: number;
  size: number;
  width: number;
  row: number;
}>();

const editorStore = useEditorStore();

const parts = computed(() => {
  let offset = 0;
  return props.content.split('~~').map((part) => {
    const o = offset;
    offset += part.length + 2;
    return { part, offset: o };
  });
});

const cells = computed(() => {
  let offset = 0;
  return parts.value[0].part.split('\\').map((cell) => {
    const o = offset;
    offset += cell.length + 1;
    return { cell, offset: o };
  });
});

const texts = computed(() => {
  return parts.value
    .slice(1)
    .map(({ part, offset }, i) => ({ text: part, offset, align: i + 1 }))
    .filter(({ text }) => text && text.trim());
});

const iconWidth = computed(() => props.size * props.cols);

const textMaxWidth = computed(() => props.width - iconWidth.value);

function isFocused(row: number, offset: number, length: number): boolean {
  const { selection } = editorStore;
  return (
    selection != null &&
    selection.row == row &&
    selection.offset >= offset &&
    selection.offset <= offset + length
  );
}
</script>

<style lang="scss" module>
.row {
  display: flex;
  align-items: stretch;

  >.cells {
    display: flex;
    justify-content: center;
  }

  >.texts {
    flex-grow: 1;
    flex-shrink: 1000;
    display: flex;
  }

  .selection {
    position: relative;

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
}
</style>
