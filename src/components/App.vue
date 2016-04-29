<template>
  <div class="app">
    <editor class="editor"></editor>
    <div class="scroller">
      <preview class="preview"></preview>
    </div>
  </div>
</template>

<script>
import Editor from './Editor.vue'
import Preview from './Preview.vue'

export default {
  components: { Editor , Preview }
}
</script>

<style lang="sass" scoped>
.app {
  display: flex;
  height: 100%;
}

.editor {
  flex-grow: 1;
}

.scroller {
  flex-basis: 600px;
  overflow: scroll;
  background: #f9f9f9;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1.0);
}
</style>
