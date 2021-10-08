<template>
  <div
    class="bs-text"
    :class="`text-${align}`"
    :title="content"
    @click="handleClick"
  >{{ content }}</div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";

import { useStore } from "@/store";
import ISelection from "@/types/selection";

const props = defineProps<{
  content: string;
  align: number;
  row: number;
  offset: number;
}>();

const store = useStore();
const setSelection = (selection: ISelection | null) => store.commit("setSelection", selection);

function handleClick(): void {
  setSelection({
    row: props.row,
    offset: props.offset,
    length: props.content.length,
  });
}
</script>

<style>
.bs-text {
  user-select: none;
  cursor: pointer;
  margin: 0 5px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bs-text.text-4 {
  flex-grow: 1;
  text-align: end;
}
</style>
