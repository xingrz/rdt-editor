<template>
  <BSSelectable v-slot="{ selectable }" :row="props.row" :offset="props.offset" :length="props.content.length">
    <n-dropdown show-arrow placement="right" :trigger="dropdownTrigger" :options="dropdownOptions"
      :render-label="renderDropdownLabel" :render-icon="renderDropdownIcon">
      <div :class="[selectable, $style.cell]" :style="style" @click="handleClick">
        <BSIcon v-for="(icon, index) in (parts?.icons || [])" :key="index" :content="icon" :stacked="stacked"
          @ratio="(ratio: number) => updateRatio(index, ratio)" />
      </div>
    </n-dropdown>
  </BSSelectable>
</template>

<script lang="ts" setup>
import {
  type CSSProperties,
  type VNode,
  computed,
  defineProps,
  h,
  ref,
} from 'vue';

import {
  type DropdownOption,
  NDropdown,
} from 'naive-ui';

import { useEditorStore } from '@/stores/editor';
import styleFromParams from '@/utils/styleFromParams';

import BSSelectable from './BSSelectable.vue';
import BSIcon from './BSIcon.vue';

const props = defineProps<{
  content: string;
  row: number;
  offset: number;
}>();

const editorStore = useEditorStore();

const ratio = ref(1);

const parts = computed(() => {
  if (!props.content) return;

  const [nonParam, ...params] = props.content.split('!_');
  const [nonLink, ...links] = nonParam.split('!@');
  const icons = nonLink.split('!~').filter((icon) => !!icon);

  return { icons, links, params };
});

const stacked = computed(() => !!parts.value && parts.value.icons.length > 1);

const style = computed(() => ({
  ...styleFromParams(parts.value?.params?.[0], true),
  '--bs-map-cell-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);

function handleClick(): void {
  editorStore.selection = {
    row: props.row,
    offset: props.offset,
    length: props.content.length,
    from: 'preview',
  };
}

function updateRatio(layer: number, newRatio: number): void {
  if (layer == 0) {
    // Only ratio of the first icon affects the cell
    ratio.value = newRatio;
  }
}

const dropdownTrigger = computed(() => (parts.value?.icons || []).length > 0 ? 'hover' : 'manual');

const dropdownOptions = computed(() => (parts.value?.icons || []).map((icon) => ({
  label: icon,
  key: icon
} as DropdownOption)));

function renderDropdownLabel(option: DropdownOption): VNode {
  return h('code', null, option.label as string);
}

function renderDropdownIcon(option: DropdownOption): VNode {
  return h(BSIcon, {
    content: option.label as string,
    stacked: stacked.value,
    style: {
      width: '20px',
      height: '20px',
      border: '1px solid #ddd',
    } as CSSProperties,
  });
}
</script>

<style lang="scss" module>
.cell {
  position: relative;
  cursor: pointer;
  width: calc(var(--bs-map-size) * var(--bs-map-cell-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
}
</style>
