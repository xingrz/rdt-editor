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
    };
  },
  watch: {
    scroll(scroll) {
      getEditor(this).setScrollPosition({ scrollTop: scroll });
    },
    width() {
      this.handleResize();
    },
    resizing() {
      this.handleResize();
    },
    content(content) {
      this.$store.commit('save', content);
    }
  },
  computed: {
    editorWidth() {
      return window.innerWidth - this.width - 8;
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
    },
    handleResize() {
      getEditor(this).layout();
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
