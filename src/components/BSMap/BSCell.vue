<template>
  <BSSelectable v-slot="{ selectable }" :focused="props.focused">
    <div :class="[selectable, $style.cell]" :title="props.src" :style="style" @click="() => emit('select')">
      <BSIcon v-for="(icon, index) in (parts?.icons || [])" :key="index" :class="$style.icon" :src="icon"
        @ratio="(ratio: number) => updateRatio(index, ratio)" />
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  computed,
  defineEmits,
  defineProps,
  ref,
} from 'vue';

import styleFromParams from '@/utils/styleFromParams';

import BSSelectable from './BSSelectable.vue';
import BSIcon from './BSIcon.vue';

const props = defineProps<{
  src: string;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
}>();

const ratio = ref(1);

const parts = computed(() => {
  if (!props.src) return;

  const [nonParam, ...params] = props.src.trim().split('!_');
  const [nonLink, ...links] = nonParam.split('!@');
  const icons = nonLink.split('!~').filter((icon) => !!icon);

  return { icons, links, params };
});

const style = computed(() => ({
  ...styleFromParams(parts.value?.params?.[0], true),
  '--bs-map-cell-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

function updateRatio(layer: number, newRatio: number): void {
  if (layer == 0) {
    // Only ratio of the first icon affects the cell
    ratio.value = newRatio;
  }
}
</script>

<style lang="scss" module>
.cell {
  position: relative;
  width: calc(var(--bs-map-size) * var(--bs-map-cell-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
}

.icon {
  position: absolute;
}
</style>
