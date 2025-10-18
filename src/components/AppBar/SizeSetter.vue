<template>
  <n-popover trigger="click" placement="top-start" :show-arrow="false">
    <template #trigger>
      <n-button quaternary size="tiny" block>
        <template #icon>
          <n-icon>
            <CopyOutline />
          </n-icon>
        </template>
        {{ editorStore.size }}px
      </n-button>
    </template>
    <div :class="$style.setter">
      <n-slider v-model:value="editorStore.size" :min="20" :max="60" />
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
import {
  NButton,
  NIcon,
  NPopover,
  NSlider,
} from 'naive-ui';
import { CopyOutline } from '@vicons/ionicons5';

import { useEditorStore } from '@/stores/editor';

const editorStore = useEditorStore();
</script>

<style lang="scss" module>
.setter {
  width: 200px;
  padding: 8px var(--n-option-prefix-width);
}
</style>
