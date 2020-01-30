<template>
  <div
    class="bs-cell"
    v-bind:title="content"
    v-bind:style="{ width: size + 'px', height: size + 'px' }"
    v-on:click="handleClick"
  >
    <BSIcon
      v-for="(icon, index) in icons"
      v-bind:key="index"
      v-bind:content="icon"
      v-bind:size="size"
    />
  </div>
</template>

<script>
import BSIcon from './BSIcon.vue'

export default {
  name: 'BSCell',
  components: {
    BSIcon,
  },
  props: {
    content: String,
    size: Number,
    row: Number,
    offset: Number,
  },
  computed: {
    icons() {
      return this.content ? this.content.split('!~') : [];
    },
  },
  methods: {
    handleClick() {
      this.$store.commit('setSelection', {
        row: this.row,
        offset: this.offset,
        length: this.content.length,
        from: 'preview',
      });
    },
  },
}
</script>

<style>
.bs-cell {
  position: relative;
  cursor: pointer;
}
</style>
