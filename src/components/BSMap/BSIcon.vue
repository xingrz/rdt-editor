<template>
  <div v-if="text" :class="$style.text" :style="style">
    <span>{{ text.data }}</span>
  </div>
  <img v-else :class="$style.icon" :style="style" :src="icon?.data" />
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  computed,
  defineEmits,
  defineProps,
  watch,
} from 'vue';

import { useIconStore } from '@/stores/icon';
import styleFromParams from '@/utils/styleFromParams';

const props = defineProps<{
  content: string;
  stacked: boolean;
}>();

const emit = defineEmits<{
  (e: 'ratio', ratio: number): void;
}>();

const iconStore = useIconStore();

const content = computed<string>(() => {
  return props.stacked ? props.content.split('__')[0] : props.content;
});

const params = computed<string | undefined>(() => {
  // available only for stacked icons
  return props.stacked ? props.content.split('__')[1] : undefined;
});

const text = computed(() => {
  let match: RegExpMatchArray | null = null;
  if (content.value && (match = content.value.match(/^(.*)\*([^_]+)$/))) {
    const ratio = selectTextWidth(match[1]) as number;
    const data = match[2];
    return { data, ratio };
  } else {
    return undefined;
  }
});

const icon = computed(() => text.value ? undefined : iconStore.icons[content.value]);

watch(content, (content) => {
  if (content && !text.value) {
    iconStore.resolve(content);
  }
}, { immediate: true });

const ratio = computed(() => (text.value ?? icon.value)?.ratio ?? 1);
watch(ratio, (ratio) => emit('ratio', ratio), { immediate: true });

const style = computed(() => ({
  ...styleFromParams(params.value, true),
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
  position: absolute;
  user-select: none;

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
    vertical-align: var(--bs-map-cell-valign, center);
  }
}
</style>
