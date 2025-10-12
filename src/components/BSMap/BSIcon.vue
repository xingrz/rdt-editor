<template>
  <div v-if="props.icon.kind == 'text'" :class="$style.text" :style="style">
    <span>{{ props.icon.text }}</span>
  </div>
  <img v-else :class="$style.icon" :style="style" :src="icon?.data" />
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, watch } from 'vue';

import type { RDTIcon, RDTText } from '@/ast';
import { useIconStore } from '@/stores/icon';
import styleFromParams from '@/utils/styleFromParams';

const props = defineProps<{
  icon: RDTIcon | RDTText;
}>();

const emit = defineEmits<{
  (e: 'ratio', ratio: number): void;
}>();

const iconStore = useIconStore();

const icon = computed(() => props.icon.kind == 'icon'
  ? iconStore.icons[props.icon.name]
  : undefined);

watch(() => props.icon, (icon) => {
  if (icon.kind == 'icon' && typeof iconStore.icons[icon.name] == 'undefined') {
    iconStore.resolve(icon.name);
  }
}, { immediate: true });

const ratio = computed(() => (props.icon.kind == 'text'
  ? selectTextWidth(props.icon.prefix)
  : icon.value?.ratio
) ?? 1);
watch(ratio, (ratio) => emit('ratio', ratio), { immediate: true });

const style = computed(() => ({
  ...styleFromParams(props.icon.params, true),
  '--bs-map-icon-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

function selectTextWidth(flag: string | undefined): number | undefined {
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
