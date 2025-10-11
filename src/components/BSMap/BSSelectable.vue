<template>
  <slot :selectable="{
    [$style.selectable]: true,
    [$style.focused]: props.focused,
  }" />
</template>

<script lang="ts" setup>
const props = defineProps<{
  focused: boolean;
}>();
</script>

<style lang="scss" module>
.selectable {
  position: relative;
  user-select: none;
  cursor: pointer;

  &::after {
    display: block;
    content: "";

    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background: #0099ff;
    opacity: 0;

    transition: opacity 200ms;
  }

  &:hover::after {
    opacity: 0.2;
  }

  &.focused::after {
    opacity: 0.3;
  }
}
</style>
