<template>
  <div v-if="label" :class="$style.label" :style="style" :data-bold="label.params.b || label.params.bold"
    :data-align="(label.params.align || ``).toUpperCase()">
    <span>{{ label.text }}</span>
  </div>
  <img v-else :class="$style.icon" :style="style" :src="icon?.data" />
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  computed,
  defineEmits,
  defineProps,
  onMounted,
  toRef,
  watch,
} from 'vue';
import { parse } from 'qs';

import { useIconStore } from '@/stores/icon';

const props = defineProps<{
  content: string;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'ratio', ratio: number): void;
}>();

const iconStore = useIconStore();

const content = toRef(props, 'content');

const label = computed(() => {
  if (content.value && content.value.match(/^(.*)\*([^_]+)(__(.+)$)?/)) {
    const ratio = selectTextWidth(RegExp.$1) as number;
    const text = RegExp.$2;
    const params = parseTextParams(RegExp.$4 || '');
    return { text, ratio, params };
  } else {
    return null;
  }
});

const icon = computed(() => label.value ? undefined : iconStore.icons[content.value]);

watch(content, (content) => !label.value && iconStore.resolve(content));
onMounted(() => content.value && !label.value && iconStore.resolve(content.value));

const ratio = computed(() => {
  if (!content.value) return 1;
  if (label.value) {
    return label.value.ratio || 1;
  } else {
    return icon.value?.ratio || 1;
  }
});

watch(ratio, (ratio) => emit('ratio', ratio));
onMounted(() => emit('ratio', ratio.value));

const style = computed(() => ({
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
    case 'b':
      return 2;
    case 's':
      return 4;
    case 'w':
      return 8;
  }
}

function parseTextParams(str: string): Record<string, string> {
  return parse(str, {
    delimiter: ','
  }) as Record<string, string>;
}
</script>

<style lang="scss" module>
.icon,
.label {
  position: absolute;
  user-select: none;

  width: calc(var(--bs-map-size) * var(--bs-map-icon-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
}

.label {
  font-family: monospace;
  font-size: calc(var(--bs-map-size) * 1px - 8px);
  text-align: center;

  span {
    line-height: 0.75;
  }

  &[data-align="L"] {
    text-align: left;
  }

  &[data-align="R"] {
    text-align: right;
  }

  &[data-align="A"] span {
    vertical-align: top;
  }

  &[data-align="E"] span {
    vertical-align: bottom;
  }

  &[data-bold="1"] {
    font-weight: bold;
  }
}
</style>
