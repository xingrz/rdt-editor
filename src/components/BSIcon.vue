<template>
  <img
    class="bs-icon"
    v-bind:style="{ width: size + 'px', height: size + 'px' }"
    v-bind:src="content ? $store.state.icon.data[content] : null"
  />
</template>

<script>
export default {
  name: 'BSIcon',
  props: {
    content: String,
    size: Number,
  },
  created() {
    if (this.content) {
      this.$store.dispatch('fetch', this.content);
    }
  },
}
</script>

<style>
.bs-icon {
  position: absolute;
  user-select: none;
}
</style>
