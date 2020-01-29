<template>
  <div class="bs-row" v-bind:style="{ height: size + 'px' }">
    <div class="cells" v-bind:style="{ width: (size * cols) + 'px' }">
      <BSCell
        v-for="(cell, index) in cells"
        v-bind:key="index"
        v-bind:content="cell"
        v-bind:size="size"
      />
    </div>
    <div class="texts" v-bind:style="{ lineHeight: size + 'px' }">
      <div
        v-for="(text, index) in texts"
        v-bind:key="index"
        v-bind:class="'text-' + index"
      >{{text.trim()}}</div>
    </div>
  </div>
</template>

<script>
import BSCell from './BSCell.vue'

export default {
  name: 'BSRow',
  components: {
    BSCell,
  },
  props: {
    content: String,
    cols: Number,
    size: Number,
  },
  computed: {
    parts() {
      return this.content.split('~~');
    },
    cells() {
      return this.parts[0].split('\\');
    },
    texts() {
      return this.parts.slice(1);
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
  flex: 1;
  font-family: monospace;
}
</style>
