<template>
  <div id="app">
    <Resizable v-bind:width="width" v-on:resize="handleResize">
      <template v-slot:default>
        Hello world
      </template>
      <template v-slot:fixed>
        Resizable
      </template>
    </Resizable>
  </div>
</template>

<script>
import Resizable from './components/Resizable.vue'

export default {
  name: 'app',
  components: {
    Resizable,
  },
  computed: {
    width() {
      const max = window.innerWidth - 200;
      const min = 200;
      const width = this.$store.state.editor.width;
      return Math.max(Math.min(width, max), min);
    },
  },
  methods: {
    handleResize(size) {
      this.$store.commit('resize', size);
    },
  },
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>
