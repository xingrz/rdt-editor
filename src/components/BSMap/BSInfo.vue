<template>
  <BSSelectable v-slot="{ selectable }" :focused="props.focused">
    <div :class="[selectable, $style.info]" :data-column="info.column" :title="props.info.text"
      @click="() => emit('select')">
      {{ props.info.text }}
    </div>
  </BSSelectable>
</template>

<script lang="ts" setup>
import type { RDTInfo } from '@/ast';
import BSSelectable from './BSSelectable.vue';

const props = defineProps<{
  info: RDTInfo;
  focused: boolean;
}>();

const emit = defineEmits<{
  (e: 'select'): void;
}>();
</script>

<style lang="scss" module>
.info {
  margin: 0 5px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &[data-column="4"] {
    flex-grow: 1;
    text-align: end;
  }
}
</style>
