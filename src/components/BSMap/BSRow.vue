<template>
  <div :class="$style.row">
    <div :class="$style.cells" :style="rowStyle">
      <BSCell v-for="(cell, index) in props.row.cells" :key="index" :cell="cell"
        :focused="isFocused(cell.offset, cell.length)" @select="() => emit('select', cell.offset, cell.length)"
        @ratio="(ratio: number) => updateRatio(index, ratio)" />
    </div>
    <div :class="$style.infos">
      <BSInfo v-for="(info, index) in props.row.rInfo.filter(({ text }) => !!text)" :key="index" :info="info"
        :focused="isFocused(info.offset, info.length)" @select="() => emit('select', info.offset, info.length)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';

import type { RDTRow } from '@/ast';
import { useEditorStore } from '@/stores/editor';
import styleFromParams from '@/utils/styleFromParams';

import BSCell from './BSCell.vue';
import BSInfo from './BSInfo.vue';
import { sum } from 'radash';

const props = defineProps<{
  row: RDTRow;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', offset: number, length: number): void;
  (e: 'width', width: number): void;
}>();

const editorStore = useEditorStore();

function isFocused(offset: number, length: number): boolean {
  const { selection } = editorStore;
  return (
    props.focused &&
    typeof selection != 'undefined' &&
    selection.offset >= offset - props.row.offset &&
    selection.offset <= offset - props.row.offset + length
  );
}

const ratios = ref<number[]>([]);

function updateRatio(cellIndex: number, ratio: number): void {
  ratios.value[cellIndex] = ratio;
}

watchEffect(() => {
  emit('width', sum(props.row.cells.map((_, index) => ratios.value[index] ?? 1)));
});

const rowStyle = computed(() => styleFromParams(props.row.params));
</script>

<style lang="scss" module>
.row {
  display: flex;
  align-items: stretch;
}

.cells {
  flex: 0 0 calc(var(--bs-map-size) * var(--bs-map-cols) * 1px);
  display: flex;
  justify-content: center;
}

.infos {
  flex: 1 1 auto;
  display: flex;
}
</style>
