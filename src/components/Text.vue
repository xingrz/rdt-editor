<template>
  <div class="text" :title="text" :data-align="align" @click="onClick">
    <span>{{text}}</span>
  </div>
</template>

<script>
import { select } from '../vuex/actions'

const ROW_SEP = '\n'.length
const TEXT_SEP = '~~'.length

export default {
  props: [ 'text', 'align' ],
  vuex: {
    actions: {
      select
    }
  },
  methods: {
    onClick: function () {
      let $row = this.$parent
      let $preview = $row.$parent

      let row = $($row.$el).data('row')
        , align = $(this.$el).data('align')

      let selectionStart = $row._meta.divider + TEXT_SEP

      for (let i = 0; i < row; i++) {
        selectionStart += $preview.$children[i].src.length + ROW_SEP
      }

      let texts = $row._meta.texts
      let selection

      if (texts.length == 1) {
        selection = texts[0]
      } else {
        selection = texts[align - 1]
        for (let i = 0; i < align - 1; i++) {
          selectionStart += texts[i].length + TEXT_SEP
        }
      }

      let selectionEnd = selectionStart + selection.length

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

  font-size: 12px;
  font-family: $monospace;

  line-height: 20px;

  text-overflow: ellipsis;
  overflow: hidden;

  position: relative;

  > span {
    display: block;
    position: absolute;
    left: 5px;
    right: 5px;
  }
}
</style>
