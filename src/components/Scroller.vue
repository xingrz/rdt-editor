<template>
  <div ref="scroller" class="scroller" @scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRef, ref, watch } from "vue";

import { useStore } from "@/store";

const props = defineProps<{
  scroll: number;
}>();

const store = useStore();
const setScroll = (scroll: number) => store.commit("setScroll", scroll);

const scroller = ref<HTMLElement | null>(null);

const scroll = toRef(props, 'scroll');
watch(scroll, (scroll) => {
  if (scroller.value) {
    scroller.value.scrollTop = scroll;
  }
});

function onScroll(): void {
  if (scroller.value != null) {
    setScroll(scroller.value.scrollTop);
  }
}
</script>

<style>
.scroller {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: #f9f9f9;
}
</style>
