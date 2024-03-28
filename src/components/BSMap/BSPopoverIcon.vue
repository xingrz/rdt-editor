<template>
  <div :class="$style.cell" :style="style">
    <BSIcon :src="props.src" />
  </div>
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, defineProps } from 'vue';

import styleFromParams from '@/utils/styleFromParams';

import BSIcon from './BSIcon.vue';

const props = defineProps<{
  src: string;
  ratio: number | undefined;
  params: string | undefined;
}>();

const style = computed(() => ({
  ...styleFromParams(props.params, true),
  '--bs-map-cell-ratio': (props.ratio == 1 ? undefined : props.ratio),
}) as CSSProperties);
</script>


<style lang="scss" module>
.cell {
  --bs-map-size: 20;
  width: calc(var(--bs-map-size) * var(--bs-map-cell-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
  line-height: calc(var(--bs-map-size) * 1px);
  border: 1px solid #ddd;
}
</style>
