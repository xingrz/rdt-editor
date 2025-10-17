<template>
  <BSSelectable v-slot="{ selectable }" :focused="props.focused">
    <div :class="[selectable, $style.cell]" :title="props.cell.src" :style="style" @click="() => emit('select')">
      <template v-for="(icon, index) in props.cell.icons" :key="index">
        <BSIcon v-if="icon.kind == 'icon'" :class="$style.icon" :icon="icon"
          @ratio="(ratio: number) => updateRatio(index, ratio)" />
        <BSText v-else-if="icon.kind == 'text'" :class="$style.icon" :icon="icon"
          @ratio="(ratio: number) => updateRatio(index, ratio)" />
      </template>
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, ref } from 'vue';

import type { RDTCell } from '@/ast';
import styleFromParams from '@/utils/styleFromParams';

import BSSelectable from './BSSelectable.vue';
import BSIcon from './BSIcon.vue';
import BSText from './BSText.vue';

const props = defineProps<{
  cell: RDTCell;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
}>();

const ratio = ref(1);

const style = computed(() => ({
  ...styleFromParams(props.cell.params, true),
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
