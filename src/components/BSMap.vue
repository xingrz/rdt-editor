<template>
  <div class="bs-map">
    <BSRow
      v-for="(row, index) in rows"
      v-bind:key="index"
      v-bind:content="row"
      v-bind:cols="cols"
      v-bind:size="size"
      v-bind:row="index"
    />
  </div>
</template>

<script>
import BSRow from './BSRow.vue'

export default {
  name: 'BSMap',
  components: {
    BSRow,
  },
  props: {
    content: String,
    size: Number,
  },
  computed: {
    rows() {
      return this.content.split('\n');
    },
    cols() {
      let cols = 0;
      for (let row of this.rows) {
        const c = Math.max(cols, row.split('\\').length);
        if (c > cols) cols = c;
      }
      return cols;
    },
  },
}
</script>

<style>
</style>
