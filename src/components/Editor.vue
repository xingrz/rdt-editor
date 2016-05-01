<template>
  <textarea
    class="editor"
    @keyup="syncSource"
    @mouseup="moveFocus"
    @scroll="onScroll"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
  >{{ source.source }}</textarea>
</template>

<script>
import { sync, select } from '../vuex/actions'

export default {
  props: { scroll: { twoWay: true } },
  vuex: {
    getters: {
      source: state => state.source,
      selection: state => state.selection
    },
    actions: { sync, select }
  },
  watch: {
    selection (value) {
      if (value.from != 'editor') {
        this.$el.selectionStart = value.start
        this.$el.selectionEnd = value.end
        this.$el.focus()
      }
    },
    scroll (value) {
      this.$el.scrollTop = value
    }
  },
  methods: {
    syncSource () {
      this.sync('editor', this.$el.value)
      this.moveFocus()
    },
    moveFocus () {
      this.select('editor', this.$el.selectionStart, this.$el.selectionEnd)
    },
    onScroll () {
      this.scroll = this.$el.scrollTop
    }
  }
}
</script>

<style lang="sass" scoped>
$monospace: 'Consolas', 'Courier', 'Menlo', 'Source Code Pro',
            'PingFang SC', 'Microsoft Yahei',
            monospace;

.editor {
  margin: 0;
  padding: 20px;
  border: none;
  outline: none;
  font-family: $monospace;
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
  resize: none;
  box-sizing: border-box;
}
</style>
