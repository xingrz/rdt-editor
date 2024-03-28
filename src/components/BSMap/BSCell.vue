<template>
  <BSSelectable v-slot="{ selectable }" :focused="props.focused">
    <BSPopover v-model:show="popoverShown" :ratio="ratio" :icons="parts?.icons || []" :params="parts?.params"
      @select="(offset, length) => emit('select', offset, length)">
      <div :class="[selectable, $style.cell]" :style="style" @click="() => emit('select', 0, props.src.length)"
        @click.right.prevent="handleRightClick">
        <BSIcon v-for="({ part }, index) in (parts?.icons || [])" :key="index" :class="$style.icon" :src="part"
          @ratio="(ratio: number) => updateRatio(index, ratio)" />
      </div>
    </BSPopover>
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

import splitWithOffset from '@/utils/splitWithOffset';
import styleFromParams from '@/utils/styleFromParams';

import BSSelectable from './BSSelectable.vue';
import BSPopover from './BSPopover.vue';
import BSIcon from './BSIcon.vue';

const props = defineProps<{
  src: string;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', offset: number, length: number): void;
}>();

const ratio = ref(1);

const parts = computed(() => {
  if (!props.src) return;

  const match = props.src.match(/^( *)([^ ]+)( *)$/);
  const leading = (match?.[1] || '').length;
  const nonSpace = match?.[2] || props.src;

  const [nonParam, ...params] = nonSpace.split('!_');
  const [nonLink, ...links] = nonParam.split('!@');
  const icons = splitWithOffset(nonLink, '!~', leading).filter(({ part }) => !!part);

  return { icons, links, params };
});

const style = computed(() => ({
  ...styleFromParams(parts.value?.params?.[0], true),
  '--bs-map-cell-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

const popoverShown = ref(false);

function handleRightClick(): void {
  popoverShown.value = true;
  emit('select', 0, props.src.length);
}

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
