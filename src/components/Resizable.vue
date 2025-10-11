<template>
  <div :class="{ [$style.resizable]: true, [$style.resizing]: resizing }" @mousemove="onResizeMove"
    @mouseup="onResizeEnd">
    <div :class="$style.main">
      <slot></slot>
    </div>
    <div :class="$style.resizer" v-on:mousedown="onResizeStart"></div>
    <div :style="{ width: `${width || 200}px` }">
      <slot name="fixed"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  width: number;
}>();

const emit = defineEmits<{
  (e: 'update:width', width: number): void;
}>();

const resizing = ref(false);
const clientX = ref(0);

function onResizeStart(evt: MouseEvent): void {
  resizing.value = true;
  clientX.value = evt.clientX;
}

function onResizeMove(evt: MouseEvent): void {
  if (resizing.value) {
    emit('update:width', props.width - (evt.clientX - clientX.value));
    clientX.value = evt.clientX;
  }
}

function onResizeEnd(): void {
  if (resizing.value) {
    resizing.value = false;
  }
}
</script>

<style lang="scss" module>
.resizable {
  display: flex;
  align-items: stretch;

  >.main {
    flex: 1;
  }

  >.resizer {
    width: 8px;
    cursor: col-resize;
    background: #ccc;
  }

  &.resizing>.resizer {
    background: #bbb;
  }
}
</style>
