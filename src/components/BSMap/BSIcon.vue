<template>
  <div v-if="parts.type == 'text'" :class="$style.text" :style="style">
    <span>{{ parts.data }}</span>
  </div>
  <img v-else :class="$style.icon" :style="style" :src="parts.data" />
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, watch } from 'vue';

import { useIconStore } from '@/stores/icon';
import styleFromParams from '@/utils/styleFromParams';

const props = defineProps<{
  src: string;
}>();

const emit = defineEmits<{
  (e: 'ratio', ratio: number): void;
}>();

const iconStore = useIconStore();

const parts = computed(() => {
  const [src, params] = props.src.split('__') as [string, string | undefined];
  const type = src.includes('*') ? 'text' : 'icon';

  const res = type == 'text' ? (() => {
    const [prefix, data] = src.split('*');
    return { data, ratio: selectTextWidth(prefix) };
  })() : iconStore.icons[src];

  return { src, params, type, ...res };
});

watch(parts, ({ type, src }) => {
  if (type == 'icon' && typeof iconStore.icons[src] == 'undefined') {
    iconStore.resolve(src);
  }
}, { immediate: true });

const ratio = computed(() => parts.value.ratio ?? 1);
watch(ratio, (ratio) => emit('ratio', ratio), { immediate: true });

const style = computed(() => ({
  ...styleFromParams(parts.value.params, true),
  '--bs-map-icon-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

function selectTextWidth(flag: string): number | undefined {
  switch (flag) {
    case 'o':
      return 0.125;
    case 'c':
      return 0.25;
    case 'd':
      return 0.5;
    case 'cd':
      return 0.75;
    case 'b':
      return 2;
    case 's':
      return 4;
    case 'bs':
      return 6;
    case 'w':
      return 8;
    default:
      return undefined;
  }
}
</script>

<style lang="scss" module>
.icon,
.text {
  width: calc(var(--bs-map-size) * var(--bs-map-icon-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
}

.text {
  font-family: monospace;
  font-size: calc(var(--bs-map-size) / 2 * 1px);
  text-align: var(--bs-map-cell-halign, center);
  z-index: 1; // texts are always stacked over icons

  span {
    line-height: 1;
    vertical-align: var(--bs-map-cell-valign, middle);
  }
}
</style>
