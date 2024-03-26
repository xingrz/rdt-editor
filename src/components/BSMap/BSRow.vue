<template>
  <div :class="$style.row">
    <div :class="$style.cells">
      <BSCell v-for="({ cell, offset }, index) in cells" :key="index"
        :class="{ [$style.selection]: true, [$style.focused]: isFocused(row, offset, cell.length) }" :content="cell"
        :row="row" :offset="offset" />
    </div>
    <div :class="$style.texts">
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

function isFocused(row: number, offset: number, length: number): boolean {
  const { selection } = editorStore;
  return (
    typeof selection != 'undefined' &&
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
    flex: 0 0 calc(var(--bs-map-size) * var(--bs-map-cols) * 1px);
    display: flex;
    justify-content: center;
  }

  >.texts {
    flex: 1 1 auto;
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
