<template>
  <div :class="$style.map" :style="style">
    <BSRow v-for="({ row, id }, index) in rows" :key="id" :src="row" :row="index" />
  </div>
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  computed,
  defineProps,
} from 'vue';

import { max } from 'radash';

import BSRow from './BSMap/BSRow.vue';

const props = defineProps<{
  content: string;
  size: number;
}>();

const rows = computed(() => {
  const appears: Record<string, number> = {};
  return props.content.split('\n').map((row) => {
    const id = (appears[row] ?? -1) + 1;
    appears[row] = id;
    return { row, id: `${row}#${id}` };
  });
});

const cols = computed(() => max(rows.value.map(({ row }) => row.split('\\').length)) || 1);

const style = computed(() => ({
  '--bs-map-size': props.size,
  '--bs-map-cols': cols.value,
}) as CSSProperties);
</script>

<style lang="scss" module>
.map {
  line-height: calc(var(--bs-map-size) * 1px);
}
</style>
