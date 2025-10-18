<template>
  <n-popover trigger="click">
    <template #trigger>
      <n-button quaternary size="tiny">Size: {{ editorStore.size }}</n-button>
    </template>
    <div :class="$style.setter">
      <n-slider v-model:value="editorStore.size" :min="20" :max="60" />
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
import {
  NButton,
  NPopover,
  NSlider,
} from 'naive-ui';

import { useEditorStore } from '@/stores/editor';

const editorStore = useEditorStore();
</script>

<style lang="scss" module>
.setter {
  width: 200px;
  padding: 8px var(--n-option-prefix-width);
}
</style>
