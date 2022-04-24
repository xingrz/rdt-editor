<template>
  <div class="bs-label" v-if="label" :data-overlay="index > 0" :data-bold="label.params.b || label.params.bold"
    :data-align="(label.params.align || ``).toUpperCase()" :style="{
      width: `${size * ratio}px`,
      height: `${size}px`,
      fontSize: `${size - 8}px`,
    }">
    <span>{{ label.text }}</span>
  </div>
  <img class="bs-icon" v-else :data-overlay="index > 0" :style="{
    width: `${size * ratio}px`,
    height: `${size}px`,
  }" :src="icon?.data" />
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, onMounted, toRef, watch } from 'vue';
import qs from 'querystring';

import { useStore } from '@/store';

const props = defineProps<{
  content: string;
  size: number;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'ratio', ratio: number): void;
}>();

const store = useStore();
const fetch = (name: string) => store.dispatch('fetch', name);

const content = toRef(props, 'content');
watch(content, (content) => fetch(content));
onMounted(() => content.value && fetch(content.value));

const icon = computed(() => store.state.icon.icons[content.value]);

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
  return qs.parse(str, ',', '=', {
    decodeURIComponent: (s) => s,
  }) as Record<string, string>;
}
</script>

<style>
.bs-icon,
.bs-label {
  position: absolute;
  user-select: none;
}

.bs-label {
  font-family: monospace;
  text-align: center;
}

.bs-icon[data-overlay],
.bs-label[data-overlay] {
  z-index: 1;
}

.bs-label span {
  line-height: 0.75;
}

.bs-label[data-align="L"] {
  text-align: left;
}

.bs-label[data-align="R"] {
  text-align: right;
}

.bs-label[data-align="A"] span {
  vertical-align: top;
}

.bs-label[data-align="E"] span {
  vertical-align: bottom;
}

.bs-label[data-bold="1"] {
  font-weight: bold;
}
</style>
