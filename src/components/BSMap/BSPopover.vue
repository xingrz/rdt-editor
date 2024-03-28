<template>
  <n-dropdown show-arrow trigger="manual" placement="right" :disabled="!enabled" :show="show" :options="options"
    :render-icon="renderIcon" :render-label="renderLabel" @select="onSelect" @clickoutside="onClickOutside">
    <slot />
  </n-dropdown>
</template>

<script lang="ts" setup>
import {
  type VNode,
  computed,
  defineEmits,
  defineProps,
  h,
} from 'vue';

import {
  type DropdownOption,
  NDropdown,
} from 'naive-ui';

import BSPopoverIcon from './BSPopoverIcon.vue';
import BSPopoverLabel from './BSPopoverLabel.vue';

const props = defineProps<{
  ratio: number;
  icons: {
    part: string;
    offset: number;
  }[];
  params: string[] | undefined;
}>();

const emit = defineEmits<{
  (e: 'select', offset: number, length: number): void;
}>();

const show = defineModel<boolean>('show');

type BSCellPopoverOption = DropdownOption & {
  offset: number;
};

const enabled = computed(() => props.icons.length > 0);

const options = computed(() => props.icons.map(({ part, offset }) => ({
  label: part,
  key: `${offset}_${part}`,
  offset: offset,
} as BSCellPopoverOption)));

function renderLabel(option: DropdownOption): VNode {
  return h(BSPopoverLabel, {
    src: option.label as string,
  });
}

function renderIcon(option: DropdownOption): VNode {
  return h(BSPopoverIcon, {
    src: option.label as string,
    ratio: props.ratio,
    params: props.params?.[0],
  });
}

function onSelect(_key: string, option: DropdownOption): void {
  const { label, offset } = option as BSCellPopoverOption;
  const src = (label as string).split('__')[0];
  emit('select', offset, src.length);
  show.value = false;
}

function onClickOutside(): void {
  show.value = false;
}
</script>
