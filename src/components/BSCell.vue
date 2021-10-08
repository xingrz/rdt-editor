<template>
  <div
    class="bs-cell"
    :title="content"
    :style="{ width: `${size * ratio}px`, height: `${size}px` }"
    @click="handleClick"
  >
    <BSIcon
      v-for="(icon, index) in icons"
      :key="index"
      :content="icon"
      :size="size"
      :index="index"
      @ratio="(ratio: number) => updateRatio(index, ratio)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref } from "vue";

import { useStore } from "@/store";
import ISelection from "@/types/selection";

import BSIcon from './BSIcon.vue';

const props = defineProps<{
  content: string;
  size: number;
  row: number;
  offset: number;
}>();

const store = useStore();
const setSelection = (selection: ISelection | null) => store.commit("setSelection", selection);

const ratio = ref(1);

const icons = computed(() => {
  if (!props.content) return [];
  return props.content
    .split("!~")
    .map((icon) => icon.trim())
    .filter((icon) => !!icon);
});

function handleClick(): void {
  setSelection({
    row: props.row,
    offset: props.offset,
    length: props.content.length,
  });
}

function updateRatio(index: number, newRatio: number): void {
  if (index != 0) return;
  ratio.value = newRatio;
}
</script>

<style>
.bs-cell {
  position: relative;
  cursor: pointer;
}
</style>
