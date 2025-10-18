<template>
  <n-element :class="$style.status">
    <template v-if="loading > 0">
      Loading {{ loading }} icons…
    </template>
    <template v-else>
      <n-icon :size="14" :color="themeVars.textColor2" :style="{ marginRight: '0.5em' }">
        <CheckmarkDone />
      </n-icon>
      Cached {{ ready }} icons
    </template>
  </n-element>
</template>

<script lang="ts" setup>
import { NElement, NIcon, useThemeVars } from 'naive-ui';
import { computed } from 'vue';
import { CheckmarkDone } from '@vicons/ionicons5';

import { useIconStore } from '@/stores/icon';

const themeVars = useThemeVars();
const iconStore = useIconStore();

const loading = computed(() => Object.values(iconStore.icons).filter((icon) => icon.status === 'loading').length);
const ready = computed(() => Object.values(iconStore.icons).filter((icon) => icon.status === 'ready').length);
</script>

<style lang="scss" module>
.status {
  font-size: var(--font-size-tiny);
  color: var(--text-color-1);
  display: flex;
  align-items: center;
}
</style>
