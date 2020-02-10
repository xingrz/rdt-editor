<template>
  <div
    class="bs-cell"
    v-bind:title="content"
    v-bind:style="{ width: width + 'px', height: size + 'px' }"
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
      if (!this.content) return [];
      return this.content.split('!~')
        .map(icon => icon.trim())
        .filter(icon => !!icon);
    },
    width() {
      if (this.icons.length == 0) return this.size;
      const first = this.icons[0];
      const ratio = this.$store.state.icon.ratio[first] || 1;
      return this.size * ratio;
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
