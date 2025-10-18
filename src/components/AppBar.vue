<template>
  <n-flex align="center" justify="space-between" :class="$style.appBar">
    <n-space align="center">
      <n-space align="center">
        <slot name="1" />
      </n-space>
      <n-divider vertical />
      <n-space align="center">
        <slot name="2" />
      </n-space>
    </n-space>
    <n-space align="center">
      <slot name="3" />
    </n-space>
  </n-flex>
</template>

<script lang="ts" setup>
import { NDivider, NFlex, NSpace } from 'naive-ui';
</script>

<style lang="scss" module>
.appBar {
  border-top: 1px solid #ddd;
  padding: 2px 16px;
}
</style>
