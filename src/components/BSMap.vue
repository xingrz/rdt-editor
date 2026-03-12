<template>
  <div :class="$style.map" :style="style">
    <template v-for="({ row, id }, index) in rows" :key="id">
      <BSRow v-if="row.kind == 'row'" :row="row" :focused="isFocused(index)" :has-l-info="hasLInfo"
        @select="(offset, length) => handleSelect(index, offset - row.offset, length)"
        @width="(width) => updateWidth(index, width)" />
      <BSKeyword v-else :keyword="row" :focused="isFocused(index)"
        @select="(offset, length) => handleSelect(index, offset - row.offset, length)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, ref } from 'vue';
import { max } from 'radash';

import type { RDTMap } from '@/ast';
import { useEditorStore } from '@/stores/editor';

import BSRow from './BSMap/BSRow.vue';
import BSKeyword from './BSMap/BSKeyword.vue';

const props = defineProps<{
  map: RDTMap;
  size: number;
}>();

const editorStore = useEditorStore();

const rows = computed(() => {
  const appears: Record<string, number> = {};
  return props.map.rows.map((row) => {
    const id = (appears[row.src] ?? -1) + 1;
    appears[row.src] = id;
    return { row, id: `${row.src}#${id}` };
  });
});

const widths = ref<number[]>([]);

function updateWidth(rowIndex: number, width: number): void {
  widths.value[rowIndex] = width;
}

const cols = computed(() => max(props.map.rows
  .map((row, index) => ({ ...row, width: widths.value[index] }))
  .filter((row) => row.kind == 'row')
  .map((row) => row.width ?? row.cells.length)
) || 1);

const hasLInfo = computed(() => props.map.rows.some(
  (row) => row.kind === 'row' && row.lInfo.some(({ text }) => !!text)
));

const style = computed(() => ({
  '--bs-map-size': props.size,
  '--bs-map-cols': cols.value,
}) as CSSProperties);

function isFocused(row: number): boolean {
  const { selection } = editorStore;
  return (
    typeof selection != 'undefined' &&
    selection.row == row
  );
}

function handleSelect(row: number, offset: number, length: number): void {
  editorStore.selection = {
    row: row,
    offset: offset,  // row offset, not global offset
    length: length,
    from: 'preview',
  };
}
</script>

<style lang="scss" module>
.map {
  line-height: calc(var(--bs-map-size) * 1px);
}
</style>
