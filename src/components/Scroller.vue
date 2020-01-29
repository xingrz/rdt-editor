<template>
  <div class="scroller">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Scroller',
}
</script>

<style>
.scroller {
  height: 100vh;
  overflow-y: scroll;
}
</style>
