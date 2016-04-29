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

export default {
  props: [ 'src' ],
  components: { Icon },
  vuex: {
    getters: {
      source: state => state.source
    },
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
      let row = $(this.$el).parents('[data-row]').data('row')
        , cell = $(this.$el).data('cell')

      let rows = this.source.split('\n').slice(0, row + 1)
        , cells = rows.pop().split('\\').slice(0, cell + 1)

      let above = rows.join('\n').length
      above = rows.length ? above + 1 : 0

      let selection = cells.pop()

      let divider = selection.indexOf('~~')
      if (divider >= 0) {
        selection = selection.substring(0, divider)
      }

      let start = cells.join('\\').length
      start = cells.length ? start + 1 : 0

      let selectionStart = above + start
        , selectionEnd = selectionStart + selection.length

      this.select(selectionStart, selectionEnd)
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
