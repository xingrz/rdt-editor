<template>
  <img :class="$style.icon" :style="style" :src="icon?.data" />
</template>

<script lang="ts" setup>
import { type CSSProperties, computed, watch } from 'vue';

import type { RDTIcon } from '@/ast';
import { useIconStore } from '@/stores/icon';
import styleFromParams from '@/utils/styleFromParams';

const props = defineProps<{
  icon: RDTIcon;
}>();

const emit = defineEmits<{
  (e: 'ratio', ratio: number): void;
}>();

const iconStore = useIconStore();
const icon = computed(() => iconStore.icons[props.icon.name]);

watch(() => props.icon, (icon) => {
  if (typeof iconStore.icons[icon.name] == 'undefined') {
    iconStore.resolve(icon.name);
  }
}, { immediate: true });

const ratio = computed(() => icon.value?.ratio ?? 1);
watch(ratio, (ratio) => emit('ratio', ratio), { immediate: true });

const style = computed(() => ({
  ...styleFromParams(props.icon.params, true),
  '--bs-map-icon-ratio': (ratio.value == 1 ? undefined : ratio.value),
}) as CSSProperties);
</script>

<style lang="scss" module>
.icon {
  width: calc(var(--bs-map-size) * var(--bs-map-icon-ratio, 1) * 1px);
  height: calc(var(--bs-map-size) * 1px);
}
</style>
