<template>
  <div class="app">
    <editor class="editor"></editor>
    <scroller class="scroller" :offset="offset" @scrolly="syncScroll">
      <preview class="preview"></preview>
    </scroller>
  </div>
</template>

<script>
import Editor from './Editor.vue'
import Scroller from './Scroller.vue'
import Preview from './Preview.vue'

import { scroll } from '../vuex/actions'

export default {
  components: { Editor , Scroller, Preview },
  vuex: {
    getters: {
      offset: state => state.offset
    },
    actions: { scroll }
  },
  methods: {
    syncScroll (offset) {
      this.scroll(offset)
    }
  }
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
  background: #f9f9f9;
  box-shadow: 0 0 5px rgba(0, 0, 0, 1.0);
}
</style>
