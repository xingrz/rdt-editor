<template>
  <textarea
    class="editor"
    @keyup="syncSource"
    @mouseup="moveFocus"
    @scroll="syncScroll"
  >{{ source }}</textarea>
</template>

<script>
import { sync, scroll, select } from '../vuex/actions'

export default {
  vuex: {
    getters: {
      source: state => state.source,
      offset: state => state.offset,
      selection: state => state.selection
    },
    actions: { sync, scroll, select }
  },
  watch: {
    offset (value) {
      this.$el.scrollTop = value
    },
    selection (value) {
      this.$el.selectionStart = value.start
      this.$el.selectionEnd = value.end
      this.$el.focus()
    }
  },
  methods: {
    syncSource () {
      this.sync(this.$el.value)
      this.moveFocus()
    },
    moveFocus () {
      this.select(this.$el.selectionStart, this.$el.selectionEnd)
    },
    syncScroll () {
      this.scroll(this.$el.scrollTop)
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
