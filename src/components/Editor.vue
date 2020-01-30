<template>
  <div class="editor-container" v-bind:style="{ width: editorWidth + 'px' }">
    <MonacoEditor
      class="editor"
      ref="editor"
      v-model="content"
      v-bind:options="options"
      v-on:editorWillMount="editorWillMount"
      v-on:editorDidMount="editorDidMount"
    />
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';

function getEditor(that) {
  return that.$refs.editor.getEditor();
}

export default {
  name: 'Editor',
  components: {
    MonacoEditor,
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
      content: this.$store.state.editor.content,
      windowWidth: 0,
    };
  },
  watch: {
    scroll(scroll) {
      getEditor(this).setScrollTop(scroll);
    },
    width() {
      this.handleResize();
    },
    resizing() {
      this.handleResize();
    },
    content(content) {
      this.$store.commit('save', content);
    },
    selection({ row, offset, length, from }) {
      if (from != 'editor') {
        const range = {
          startLineNumber: row + 1,
          startColumn: offset + 1,
          endLineNumber: row + 1,
          endColumn: offset + 1 + length
        };
        getEditor(this).setSelection(range);
        getEditor(this).revealRange(range, 0);
        getEditor(this).focus();
      }
    },
  },
  computed: {
    editorWidth() {
      return this.windowWidth - this.width - 8;
    },
  },
  methods: {
    editorWillMount(monaco) {
      monaco.languages.register({ id: 'rdt' });
      monaco.languages.setMonarchTokensProvider('rdt', {
        tokenizer: {
          root: [
            [/(\\|!~|{|})/, 'operator'],
            [/[^\\!~]+/, 'type.identifier'],
            [/~~.*$/, 'string'],
          ],
        },
      });
    },
    editorDidMount(monaco) {
      window.addEventListener('resize', this.handleResize);
      monaco.onDidScrollChange(({ scrollTop }) => {
        this.$store.commit('setScroll', scrollTop);
      });
      monaco.onDidChangeCursorSelection(({ selection }) => {
        this.$store.commit('setSelection', {
          row: selection.startLineNumber - 1,
          offset: selection.startColumn - 1,
          length: 0,
          from: 'editor',
        });
      });
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      setTimeout(() => {
        getEditor(this).layout();
      }, 200);
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
