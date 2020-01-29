<template>
  <MonacoEditor
    class="editor"
    v-model="content"
    v-bind:options="options"
    v-on:editorWillMount="editorWillMount"
    v-on:editorDidMount="editorDidMount"
  />
</template>

<script>
import MonacoEditor from 'vue-monaco';

export default {
  name: 'Editor',
  components: {
    MonacoEditor,
  },
  props: {
    content: String,
    size: Number,
    scroll: Number,
  },
  data() {
    return {
      editor: null,
      options: {
        theme: 'vs',
        language: 'rdt',
        lineHeight: this.size,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
      },
    };
  },
  watch: {
    scroll(scroll) {
      this.editor.setScrollPosition({ scrollTop: scroll });
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
      this.editor = monaco;
      monaco.onDidScrollChange(({ scrollTop }) => {
        this.$store.commit('setScroll', scrollTop);
      });
    },
  },
}
</script>

<style>
.editor {
  width: 100%;
  height: 100%;
}
</style>
