<template>
  <div class="text" :title="text" :data-align="align" @click="onClick">
    <span>{{text}}</span>
  </div>
</template>

<script>
import { select } from '../vuex/actions'

export default {
  props: [ 'text', 'align' ],
  vuex: {
    getters: {
      source: state => state.source.source
    },
    actions: {
      select
    }
  },
  methods: {
    onClick: function () {
      let row = $(this.$el).parents('[data-row]').data('row')
        , align = $(this.$el).data('align')

      let rows = this.source.split('\n').slice(0, row + 1)
        , texts = rows.pop().split('~~')

      if (texts.length > 2) {
        texts = texts.slice(0, align + 1)
      }

      let above = rows.join('\n').length
      above = rows.length ? above + 1 : 0

      let selection = texts.pop()

      let start = texts.join('~~').length + 2

      let selectionStart = above + start
        , selectionEnd = selectionStart + selection.length

      this.select('preview', selectionStart, selectionEnd)
    }
  }
}
</script>

<style lang="sass" scoped>
$monospace: 'Consolas', 'Courier', 'Menlo', 'Source Code Pro',
            'PingFang SC', 'Microsoft Yahei',
            monospace;

.text {
  margin: 0 5px;
  padding: 0 5px;

  font-size: 12px;
  font-family: $monospace;

  line-height: 20px;

  text-overflow: ellipsis;
  overflow: hidden;

  position: relative;

  > span {
    display: block;
    position: absolute;
  }
}
</style>
