<template>
  <n-element :class="$style.position">
    Ln {{ rowIndex + 1 }}{{ position ? `, ${position}` : '' }} | Row {{ currentCols }} / Max {{ maxCols }}
  </n-element>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NElement } from 'naive-ui';
import { max } from 'radash';

import type { RDTMap } from '@/ast';
import { useEditorStore } from '@/stores/editor';

const props = defineProps<{
  map: RDTMap;
}>();

const editorStore = useEditorStore();

const rowIndex = computed(() => editorStore.selection?.row ?? 0);

const position = computed(() => {
  const { selection } = editorStore;
  if (!selection) return undefined;

  const row = props.map.rows[selection.row];
  if (!row || row.kind !== 'row') return undefined;

  const lInfo = row.lInfo.find(({ offset, length }) =>
    selection.offset >= offset - row.offset && selection.offset <= offset - row.offset + length
  );
  if (lInfo) {
    return `Left Info #${lInfo.column}`;
  }

  const rInfo = row.rInfo.find(({ offset, length }) =>
    selection.offset >= offset - row.offset && selection.offset <= offset - row.offset + length
  );
  if (rInfo) {
    return `Right Info #${rInfo.column}`;
  }

  const cell = row.cells.findIndex(({ offset, length }) =>
    selection.offset >= offset - row.offset && selection.offset <= offset - row.offset + length
  );
  if (cell != -1) {
    return `Col ${cell + 1}`;
  }

  return undefined;
});

const currentCols = computed(() => {
  const row = props.map.rows[rowIndex.value];
  if (!row || row.kind !== 'row') return 0;
  return row.cells.length;
});

const maxCols = computed(() => max(props.map.rows
  .filter((row) => row.kind == 'row')
  .map((row) => row.cells.length)
) || 1);
</script>

<style lang="scss" module>
.position {
  font-size: var(--font-size-tiny);
  color: var(--text-color-1);
}
</style>
