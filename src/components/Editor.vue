<template>
  <MonacoEditor
    class="editor"
    v-model="content"
    v-bind:options="options"
    v-on:editorWillMount="editorWillMount"
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
    };
  },
  methods: {
    editorWillMount(monaco) {
      console.log('editorWillMount');
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
  },
}
</script>

<style>
.editor {
  width: 100%;
  height: 100%;
}
</style>
