<template>
  <div class="row">
    <div class="cells">
      <template v-for="cell in cells" track-by="$index">
        <cell :src="cell" :data-cell="$index" />
      </template>
    </div>
    <div class="texts">
      <template v-for="text in texts" track-by="align">
        <text :text="text.text" :align="text.align" />
      </template>
    </div>
  </div>
</template>

<script>
import Cell from './Cell.vue'
import Text from './Text.vue'

export default {
  props: [ 'src' ],
  components: { Cell, Text },
  computed: {
    _meta () {
      let texts = this.src.split('~~')
      let cells = texts.shift()
      return {
        texts, cells,
        divider: cells.length
      }
    },
    cells () {
      return this._meta.cells.split('\\')
    },
    texts () {
      let texts = this._meta.texts
      if (texts.length == 1) {
        return texts
        .map((text) => ({
          text: text.trim(),
          align: 2
        }))
      } else {
        return texts
        .map((text, i) => ({
          text: text.trim(),
          align: i + 1
        }))
        .filter((text) => !!text.text)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.row {
  display: flex;
}

.cells > div,
.texts > div {
  height: 20px;
  cursor: pointer;

  &::after {
    display: block;
    content: '';

    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background: #0099FF;
    opacity: 0.0;

    transition: opacity 200ms;
  }

  &:hover::after {
    opacity: 0.2;
  }

  &.focus::after {
    opacity: 0.3;
  }
}

.cells {
  flex-grow: 1;
  flex-shrink: 0;

  display: flex;
  justify-content: center;

  > div {
    width: 20px;
  }
}

.texts {
  flex-basis: 200px;
  flex-shrink: 0;

  display: flex;

  > div {
    order: attr('data-align');
    flex-grow: 1;

    &[data-align="1"],
    &[data-align="2"],
    &[data-align="3"] {
      align-self: flex-start;
    }

    &[data-align="4"] {
      align-self: flex-end;
      text-align: right;
    }
  }
}
</style>
