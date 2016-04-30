<template>
  <div class="preview">
    <template v-for="row in rows" track-by="$index">
      <row :src="row" :data-row="$index"></row>
    </template>
  </div>
</template>

<script>
import Row from './Row.vue'

export default {
  components: { Row },
  vuex: {
    getters: {
      rows: state => state.source.split('\n'),
      source: state => state.source,
      selection: state => state.selection
    }
  },
  watch: {
    selection (value) {
      let rows = this.source.substring(0, value.start).split('\n')

      let line = rows.pop()

      let cells = line.split('\\')
        , texts = line.split('~~')

      let text = cells.pop() + this.source.substring(value.start).split('\n').shift()

      let row = rows.length
        , cell = cells.length
        , align

      if (text.split('~~').length == 2 && texts.length == 2) {
        align = 2
      } else {
        align = texts.length - 1
      }

      let $el = $(this.$el)
      $el.find('.focus').removeClass('focus')

      let selector = align > 0
        ? `[data-row="${row}"] .text[data-align="${align}"]`
        : `[data-row="${row}"] .cell[data-cell="${cell}"]`

      $el.find(selector).addClass('focus')
    }
  }
}
</script>

<style lang="sass" scoped>
.preview {
  padding: 20px;
}
</style>
