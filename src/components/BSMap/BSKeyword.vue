<template>
  <BSSelectable v-slot="{ selectable }" :focused="props.focused">
    <div :class="[selectable, $style.keyword]" @click="() => emit('select', 0, props.keyword.length)">
      {{ props.keyword.src }}
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import type { RDTKeyword } from '@/ast';
import BSSelectable from './BSSelectable.vue';

const props = defineProps<{
  keyword: RDTKeyword;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', offset: number, length: number): void;
}>();
</script>

<style lang="scss" module>
.keyword {
  padding: 0 5px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
