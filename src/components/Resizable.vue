<template>
  <div class="resizable" :class="{ resizing: resizing }" @mousemove="onResizeMove" @mouseup="onResizeEnd">
    <div class="main">
      <slot></slot>
    </div>
    <div class="resizer" v-on:mousedown="onResizeStart"></div>
    <div :style="{ width: `${width || 200}px` }">
      <slot name="fixed"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';

const props = defineProps<{
  width: number;
}>();

const emit = defineEmits<{
  (e: 'resizeStart'): void;
  (e: 'resize', width: number): void;
  (e: 'resizeEnd'): void;
}>();

const resizing = ref(false);
const clientX = ref(0);

function onResizeStart(evt: MouseEvent): void {
  resizing.value = true;
  clientX.value = evt.clientX;
  emit('resizeStart');
}

function onResizeMove(evt: MouseEvent): void {
  if (resizing.value) {
    emit('resize', props.width - (evt.clientX - clientX.value));
    clientX.value = evt.clientX;
  }
}

function onResizeEnd(): void {
  if (resizing.value) {
    resizing.value = false;
    emit('resizeEnd');
  }
}
</script>

<style>
.resizable {
  display: flex;
  align-items: stretch;
}

.resizable>.main {
  flex: 1;
}

.resizable>.resizer {
  width: 8px;
  cursor: col-resize;
  background: #ccc;
}

.resizable.resizing>.resizer {
  background: #bbb;
}
</style>
