<template>
  <div class="scroller" v-on:scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Scroller',
  props: {
    scroll: Number,
  },
  watch: {
    scroll(value) {
      this.$el.scrollTop = value;
    },
  },
  methods: {
    onScroll () {
      this.$store.commit('setScroll', this.$el.scrollTop);
    },
  },
}
</script>

<style>
.scroller {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
