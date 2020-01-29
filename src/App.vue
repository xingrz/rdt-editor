<template>
  <div id="app">
    <Resizable v-bind:width="width" v-on:resize="handleResize">
      <template v-slot:default>
        <Editor
          v-bind:size="$store.state.editor.size"
          v-bind:scroll="$store.state.editor.scroll"
        />
      </template>
      <template v-slot:fixed>
        <Scroller v-bind:scroll="$store.state.editor.scroll">
          <BSMap
            v-bind:content="$store.state.editor.content"
            v-bind:size="$store.state.editor.size"
          />
        </Scroller>
      </template>
    </Resizable>
  </div>
</template>

<script>
import Resizable from './components/Resizable.vue'
import Scroller from './components/Scroller.vue'
import BSMap from './components/BSMap.vue';
import Editor from './components/Editor.vue';

export default {
  name: 'app',
  components: {
    Resizable,
    Scroller,
    BSMap,
    Editor,
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
      this.$store.commit('setWidth', size);
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
