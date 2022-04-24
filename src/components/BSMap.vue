<template>
  <div class="bs-map" :style="{ lineHeight: `${size}px` }">
    <BSRow v-for="(row, index) in rows" :key="index" :content="row" :cols="cols" :size="size" :width="width"
      :row="index" />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import BSRow from './BSRow.vue';

const props = defineProps<{
  content: string;
  size: number;
  width: number;
}>();

const rows = computed(() => props.content.split('\n'));

const cols = computed(() => {
  let cols = 0;
  for (let row of rows.value) {
    const c = Math.max(cols, row.split('\\').length);
    if (c > cols) cols = c;
  }
  return cols;
});
</script>

<style>
</style>
