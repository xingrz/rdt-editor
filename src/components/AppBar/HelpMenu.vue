<template>
  <n-dropdown trigger="click" placement="top-end" :show-arrow="false" :options="options">
    <n-button quaternary size="tiny" block>
      <template #icon>
        <n-icon>
          <EllipsisHorizontal />
        </n-icon>
      </template>
    </n-button>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import {
  NButton,
  NDropdown,
  NIcon,
  type DropdownOption,
} from 'naive-ui';
import { EllipsisHorizontal } from '@vicons/ionicons5';

const options: DropdownOption[] = [
  {
    key: 'feedback',
    label: () => h('a', {
      href: 'https://github.com/xingrz/rdt-editor/issues/new',
      target: '_blank',
    }, 'Feedback'),
  },
  {
    key: 'about',
    label: () => h('a', {
      href: 'https://github.com/xingrz/rdt-editor',
      target: '_blank',
    }, 'About RDT Editor'),
  },
];
</script>
