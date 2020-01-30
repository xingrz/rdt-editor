<template>
  <div id="app">
    <Resizable
      v-bind:width="width"
      v-on:resize="handleResize"
      v-on:resizeStart="handleResizeStart"
      v-on:resizeEnd="handleResizeEnd"
    >
      <template v-slot:default>
        <Editor
          v-bind:size="$store.state.editor.size"
          v-bind:scroll="$store.state.editor.scroll"
          v-bind:width="width"
          v-bind:resizing="resizing"
          v-bind:selection="$store.state.editor.selection"
        />
      </template>
      <template v-slot:fixed>
        <Scroller v-bind:scroll="$store.state.editor.scroll">
          <BSMap
            v-bind:content="$store.state.editor.content"
            v-bind:size="$store.state.editor.size"
            v-bind:width="width"
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
  data() {
    return {
      resizing: false,
    }
  },
  computed: {
    width() {
      const max = window.innerWidth - 400;
      const min = 400;
      const width = this.$store.state.editor.width;
      return Math.max(Math.min(width, max), min);
    },
  },
  methods: {
    handleResize(size) {
      this.$store.commit('setWidth', size);
    },
    handleResizeStart() {
      this.resizing = true;
    },
    handleResizeEnd() {
      this.resizing = false;
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
