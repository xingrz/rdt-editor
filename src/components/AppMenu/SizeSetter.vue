<template>
  <div :class="$style.setter">
    <span>Icon size</span>
    <n-slider v-model:value="editorStore.size" :min="20" :max="60" />
  </div>
</template>

<script lang="ts" setup>
import {
  NSlider,
} from 'naive-ui';

import { useEditorStore } from '@/stores/editor';

const editorStore = useEditorStore();
</script>

<style lang="scss" module>
.setter {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 200px;
  padding: 8px var(--n-option-prefix-width);
  font-size: var(--n-font-size);
}
</style>
