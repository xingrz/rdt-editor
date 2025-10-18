<template>
  <n-flex align="center" justify="space-between" :class="$style.appBar">
    <n-space>
      <icon-status />
    </n-space>
    <n-space>
      <size-setter />
    </n-space>
  </n-flex>
</template>

<script lang="ts" setup>
import {
  NFlex,
  NSpace,
} from 'naive-ui';

import IconStatus from './AppBar/IconStatus.vue';
import SizeSetter from './AppBar/SizeSetter.vue';
</script>

<style lang="scss" module>
.appBar {
  border-top: 1px solid #ddd;
  padding: 0 16px;
}
</style>
