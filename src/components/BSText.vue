<template>
  <div
    class="bs-text"
    v-bind:class="'text-' + align"
    v-bind:title="content"
    v-on:click="handleClick"
  >{{content}}</div>
</template>

<script>
export default {
  name: 'BSText',
  props: {
    content: String,
    align: Number,
    row: Number,
    offset: Number,
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
.bs-text {
  user-select: none;
  cursor: pointer;
  margin: 0 5px;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bs-text.text-4 {
  flex-grow: 1;
  text-align: end;
}
</style>
