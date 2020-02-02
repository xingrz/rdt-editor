<template>
  <div class="editor-container" v-bind:style="{ width: editorWidth + 'px' }">
    <AceEditor
      class="editor"
      v-bind:value="content"
      v-bind:width="String(editorWidth)"
      height="100vh"
      mode="rdt"
      theme="tomorrow"
      v-bind:name="name"
      v-bind:onBeforeLoad="onBeforeLoad"
      v-bind:onChange="onChange"
      v-bind:onScroll="onScroll"
      v-bind:onSelectionChange="onSelectionChange"
      v-bind:style="{
        lineHeight: size + 'px',
      }"
      v-bind:editorProps="{
        $blockScrolling: Infinity,
      }"
    />
  </div>
</template>

<script>
import brace from 'brace';
import 'brace/theme/tomorrow';
import '../editor/rdt';

import { Ace as AceEditor } from 'vue2-brace-editor';

export default {
  name: 'Editor',
  components: {
    AceEditor,
  },
  props: {
    size: Number,
    scroll: Number,
    width: Number,
    resizing: Boolean,
    selection: Object,
  },
  data() {
    return {
      options: {
        theme: 'vs',
        language: 'rdt',
        lineHeight: this.size,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
      },
      name: 'rdt-editor',
      content: this.$store.state.editor.content,
      windowWidth: 0,
    };
  },
  watch: {
    scroll(scroll) {
      this.renderer.scrollToY(scroll);
    },
    selection({ row, offset, length, from }) {
      if (from != 'editor') {
        const { selection } = this.editor.getSession();
        selection.setRange({
          start: {
            row: row,
            column: offset,
          },
          end: {
            row: row,
            column: offset + length,
          },
        });
        this.renderer.scrollToX(0);
        this.renderer.scrollSelectionIntoView();
        this.editor.focus();
      }
    },
  },
  computed: {
    editorWidth() {
      return this.windowWidth - this.width - 8;
    },
  },
  methods: {
    onBeforeLoad() {
      this.editor = brace.edit(this.name);
      this.renderer = this.editor.renderer;
    },
    onChange(content) {
      this.$store.commit('save', content);
    },
    onScroll() {
      this.$store.commit('setScroll', this.renderer.scrollTop);
    },
    onSelectionChange(selection) {
      const { start } = selection.getRange();
      this.$store.commit('setSelection', {
        row: start.row,
        offset: start.column,
        length: 0,
        from: 'editor',
      });
    },
  },
}
</script>

<style>
.editor-container {
  overflow: hidden;
}

.editor {
  width: 100%;
  height: 100vh;
}
</style>
