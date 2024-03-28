<template>
  <div :class="$style.item">
    <div :class="$style.name">{{ src }}</div>
    <n-button v-if="isIcon" :class="$style.open" quaternary block @click.stop="onClick">
      <n-icon>
        <OpenOutline />
      </n-icon>
    </n-button>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

import { NButton, NIcon } from 'naive-ui';
import { OpenOutline } from '@vicons/ionicons5';

const props = defineProps<{
  src: string;
}>();

const src = computed(() => props.src.split('__')[0]);
const isIcon = computed(() => !props.src.includes('*'));

function onClick(): void {
  window.open(`https://commons.wikimedia.org/wiki/File:BSicon_${src.value}.svg`);
}
</script>

<style lang="scss" module>
.item {
  display: flex;
  width: auto;
  margin-right: calc(var(--n-option-suffix-width) * -1 + 2px);

  .name {
    flex: 1 1 auto;
    user-select: none;
    font-family: monospace;
    margin-right: 16px;
  }

  .open {
    flex: 0 0 20px;
    opacity: 0;
    transition: opacity 200ms;
  }

  &:hover {
    .open {
      opacity: 1;
    }
  }
}
</style>
