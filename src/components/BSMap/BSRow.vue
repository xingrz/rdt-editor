<template>
  <div :class="$style.row">
    <div :class="$style.cells" :style="rowStyle">
      <BSCell v-for="({ part, offset }, index) in cells" :key="index" :src="part" :row="row" :offset="offset"
        @select="() => emit('select', offset, part.length)" />
    </div>
    <div :class="$style.texts">
      <BSText v-for="({ part, offset, align }, index) in  texts" :key="index" :src="part" :align="align" :row="row"
        :offset="offset" @select="() => emit('select', offset, part.length)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps } from 'vue';

import splitWithOffset from '@/utils/splitWithOffset';
import styleFromParams from '@/utils/styleFromParams';

import BSCell from './BSCell.vue';
import BSText from './BSText.vue';

const props = defineProps<{
  src: string;
  row: number;
}>();

const emit = defineEmits<{
  (e: 'select', offset: number, length: number): void;
}>();

const parts = computed(() => {
  const [cells, ...texts] = splitWithOffset(props.src, '~~');
  return { cells, texts };
});

const cells = computed(() => splitWithOffset(parts.value.cells.part, '\\'));

const texts = computed(() => parts.value.texts
  .slice(0, 4)
  .map((part, index, { length }) => ({ ...part, align: length == 1 ? 2 : index + 1 }))
  .filter(({ part }) => !!part));

const rowStyle = computed(() => styleFromParams(parts.value.texts[4]?.part));
</script>

<style lang="scss" module>
.row {
  display: flex;
  align-items: stretch;
}

.cells {
  flex: 0 0 calc(var(--bs-map-size) * var(--bs-map-cols) * 1px);
  display: flex;
  justify-content: center;
}

.texts {
  flex: 1 1 auto;
  display: flex;
}
</style>
