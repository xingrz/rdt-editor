<template>
  <div class="preview">
    <template v-for="row in rows" track-by="$index">
      <row :src="row" :data-row="$index"></row>
    </template>
  </div>
</template>

<script>
import Row from './Row.vue'

const ROW_SEP = '\n'.length
const CELL_SEP = '\\'.length
const TEXT_SEP = '~~'.length

export default {
  components: { Row },
  vuex: {
    getters: {
      source: state => state.source.source,
      selection: state => state.selection
    }
  },
  computed: {
    rows () {
      return this.source.split('\n')
    }
  },
  watch: {
    selection (value) {
      let $el = $(this.$el)
      $el.find('.focus').removeClass('focus')

      let start = 0, row = 0, line

      for (let i = 0, offset = 0; i < this.$children.length; i++) {
        let length = this.$children[i].src.length

        if (offset <= value.start && value.start <= offset + length) {
          start = value.start - offset
          row = i
          line = this.$children[i]
          break
        }

        offset += length + ROW_SEP
      }

      if (start <= line._meta.divider) {
        let cell = 0

        for (let i = 0, offset = 0; i < line._meta.cells.length; i++) {
          let length = line._meta.cells[i].length

          if (offset <= start && start <= offset + length) {
            cell = i
            break
          }

          offset += length + CELL_SEP
        }

        $el
        .find(`[data-row="${row}"] .cell[data-cell="${cell}"]`)
        .addClass('focus')
      } else if (line._meta.texts.length == 1) {
          if (start >= line._meta.divider + TEXT_SEP) {
          $el
          .find(`[data-row="${row}"] .text`)
          .addClass('focus')
        }
      } else {
        start -= line._meta.divider + TEXT_SEP

        let align = 0

        for (let i = 0, offset = 0; i < line._meta.texts.length; i++) {
          let length = line._meta.texts[i].length

          if (offset <= start && start <= offset + length) {
            align = i + 1
            break
          }

          offset += length + TEXT_SEP
        }

        if (align > 0) {
          $el
          .find(`[data-row="${row}"] .text[data-align="${align}"]`)
          .addClass('focus')
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.preview {
  padding: 20px;
}
</style>
