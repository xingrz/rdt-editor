<template>
  <MonacoEditor
    class="editor"
    ref="editor"
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
    size: Number,
    scroll: Number,
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
      this.$refs.editor.getEditor().setScrollPosition({ scrollTop: scroll });
    },
    content(content) {
      this.$store.commit('save', content);
    }
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
