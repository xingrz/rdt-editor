<template>
  <BSSelectable v-slot="{ selectable }" :focused="props.focused">
    <div :class="[selectable, $style.text]" :data-align="align" :title="props.src" @click="() => emit('select')">
      {{ props.src }}
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';

import BSSelectable from './BSSelectable.vue';

const props = defineProps<{
  src: string;
  align: number;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
}>();
</script>

<style lang="scss" module>
.text {
  margin: 0 5px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &[data-align="4"] {
    flex-grow: 1;
    text-align: end;
  }
}
</style>
