<template>
  <div ref="scroller" :class="$style.scroller" @scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { toRef, ref, watch } from 'vue';

const props = defineProps<{
  scroll: number;
}>();

const emit = defineEmits<{
  (e: 'update:scroll', scroll: number): void;
}>();

const scroller = ref<HTMLElement | null>(null);

const scroll = toRef(props, 'scroll');
watch(scroll, (scroll) => {
  if (scroller.value) {
    scroller.value.scrollTop = scroll;
  }
});

function onScroll(): void {
  if (scroller.value != null) {
    emit('update:scroll', scroller.value.scrollTop);
  }
}
</script>

<style lang="scss" module>
.scroller {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: #f9f9f9;
}
</style>
