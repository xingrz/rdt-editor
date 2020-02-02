<template>
  <div class="bs-row">
    <div class="cells" v-bind:style="{ flexBasis: iconWidth + 'px' }">
      <BSCell
        class="selection"
        v-for="({ cell, offset }, index) in cells"
        v-bind:key="index"
        v-bind:class="{ focused: isFocused(row, offset, cell.length) }"
        v-bind:content="cell"
        v-bind:size="size"
        v-bind:row="row"
        v-bind:offset="offset"
      />
    </div>
    <div class="texts" v-bind:style="{ maxWidth: textMaxWidth + 'px' }">
      <BSText
        class="selection"
        v-for="({ text, offset, align }, index) in texts"
        v-bind:key="index"
        v-bind:class="{ focused: isFocused(row, offset, text.length) }"
        v-bind:content="text"
        v-bind:align="align"
        v-bind:row="row"
        v-bind:offset="offset"
      />
    </div>
  </div>
</template>

<script>
import BSCell from './BSCell.vue'
import BSText from './BSText.vue'

export default {
  name: 'BSRow',
  components: {
    BSCell,
    BSText,
  },
  props: {
    content: String,
    cols: Number,
    size: Number,
    width: Number,
    row: Number,
  },
  computed: {
    parts() {
      let offset = 0;
      return this.content.split('~~').map((part) => {
        const o = offset;
        offset += part.length + 2;
        return { part, offset: o };
      });
    },
    cells() {
      let offset = 0;
      return this.parts[0].part.split('\\').map((cell) => {
        const o = offset;
        offset += cell.length + 1;
        return { cell, offset: o };
      });
    },
    texts() {
      return this.parts.slice(1)
        .map(({ part, offset }, i) => ({ text: part, offset, align: i + 1 }))
        .filter(({ text }) => text && text.trim());
    },
    iconWidth() {
      return this.size * this.cols;
    },
    textMaxWidth() {
      return this.width - this.iconWidth;
    },
  },
  methods: {
    isFocused(row, offset, length) {
      const { selection } = this.$store.state.editor;
      return selection != null &&
        selection.row == row &&
        selection.offset >= offset &&
        selection.offset <= offset + length;
    },
  },
}
</script>

<style>
.bs-row {
  display: flex;
  align-items: stretch;
}

.bs-row > .cells {
  display: flex;
  justify-content: center;
}

.bs-row > .texts {
  flex-grow: 1;
  flex-shrink: 1000;
  display: flex;
}

.bs-row .selection {
  position: relative;
}

.bs-row .selection::after {
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

.bs-row .selection:hover::after {
  opacity: 0.2;
}

.bs-row .selection.focused::after {
  opacity: 0.3;
}
</style>
