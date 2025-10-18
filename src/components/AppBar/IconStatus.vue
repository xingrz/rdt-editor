<template>
  <n-element :class="$style.status">
    <template v-if="loading > 0">
      Loading {{ loading }} icons…
    </template>
    <template v-else>
      Ready, {{ ready }} icons loaded.
    </template>
  </n-element>
</template>

<script lang="ts" setup>
import { NElement } from 'naive-ui';
import { useIconStore } from '@/stores/icon';
import { computed } from 'vue';

const iconStore = useIconStore();

const loading = computed(() => Object.values(iconStore.icons).filter((icon) => icon.status === 'loading').length);
const ready = computed(() => Object.values(iconStore.icons).filter((icon) => icon.status === 'ready').length);
</script>

<style lang="scss" module>
.status {
  font-size: var(--font-size-tiny);
  color: var(--text-color-1);
}
</style>
