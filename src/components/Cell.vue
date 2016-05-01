<template>
  <div class="cell" :title="src" @click="onClick">
    <template v-for="icon in cell.icons" track-by="$index">
      <icon :name="icon" />
    </template>
  </div>
</template>

<script>
import Icon from './Icon.vue'

import { select } from '../vuex/actions'

const ROW_SEP = '\n'.length
const CELL_SEP = '\\'.length

export default {
  props: [ 'src' ],
  components: { Icon },
  vuex: {
    actions: {
      select
    }
  },
  computed: {
    cell () {
      return {
        icons: this.src.trim()
          ? this.src.split('!~').map(icon => icon.trim())
          : []
      }
    }
  },
  methods: {
    onClick: function () {
      let $row = this.$parent
      let $preview = $row.$parent

      let row = $($row.$el).data('row')
        , cell = $(this.$el).data('cell')

      let selectionStart = 0

      for (let i = 0; i < row; i++) {
        selectionStart += $preview.$children[i].src.length + ROW_SEP
      }

      let cells = $row.cells

      for (let i = 0; i < cell; i++) {
        selectionStart += cells[i].length + CELL_SEP
      }

      let selectionEnd = selectionStart + cells[cell].length

      this.select('preview', selectionStart, selectionEnd)
    }
  }
}
</script>

<style lang="sass" scoped>
.cell {
  margin: 0;
  padding: 0;
  position: relative;
}
</style>
