<template>
  <div :class="$style.row">
    <div :class="$style.cells" :style="rowStyle">
      <BSCell v-for="({ cell, offset }, index) in cells" :key="index" :content="cell" :row="row" :offset="offset" />
    </div>
    <div :class="$style.texts">
      <BSText v-for="({ text, offset, align }, index) in texts" :key="index" :content="text" :align="align" :row="row"
        :offset="offset" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import styleFromParams from '@/utils/styleFromParams';

import BSCell from './BSCell.vue';
import BSText from './BSText.vue';

const props = defineProps<{
  content: string;
  row: number;
}>();

const parts = computed(() => {
  let offset = 0;
  return props.content.split('~~').map((part) => {
    const o = offset;
    offset += part.length + 2;
    return { part, offset: o };
  });
});

const cells = computed(() => {
  let offset = 0;
  return parts.value[0].part.split('\\').map((cell) => {
    const o = offset;
    offset += cell.length + 1;
    return { cell, offset: o };
  });
});

const texts = computed(() => {
  const texts = parts.value.slice(1, 5)
    .map(({ part, offset }, i) => ({ text: part, offset, align: i + 1 }));

  // Shorthand that the only text is treated as the main (the 2nd) text
  if (texts.length == 1) {
    texts[0].align = 2;
  }

  return texts.filter(({ text }) => text != '' && text != ' ');
});

const rowStyle = computed(() => styleFromParams(parts.value[5]?.part));
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
