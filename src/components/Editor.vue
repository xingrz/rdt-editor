<template>
  <AceEditor
    class="editor"
    mode="rdt"
    theme="tomorrow"
    width="100%"
    height="100vh"
    v-bind:name="name"
    v-bind:value="$store.state.editor.content"
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
    v-bind:setOptions="{
      enableLiveAutocompletion: [
        { getCompletions, getDocTooltip },
      ],
    }"
  />
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
    selection: Object,
  },
  data() {
    return {
      name: 'rdt-editor',
    };
  },
  watch: {
    width() {
      this.handleResize();
    },
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
    handleResize() {
      this.editor.resize();
    },
    getCompletions(editor, session, pos, prefix, callback) {
      const icons = this.$store.state.icon.data;
      callback(null, Object.keys(icons)
        .filter(icon => !!icons[icon])
        .map(icon => ({ value: icon })));
    },
    getDocTooltip(item) {
      const icons = this.$store.state.icon.data;
      item.docHTML = `<img src="${icons[item.value]}" class="preview" />`;
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>

<style>
.preview {
  height: 120px;
  display: block;
}
</style>
