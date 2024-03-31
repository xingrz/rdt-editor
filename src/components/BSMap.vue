<template>
  <div :class="$style.map" :style="style">
    <BSRow v-for="(row, index) in rows" :key="index" :src="row" :row="index" />
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

const rows = computed(() => props.content.split('\n'));
const cols = computed(() => max(rows.value.map((row) => row.split('\\').length)) || 1);

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
