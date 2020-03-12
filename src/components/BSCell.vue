<template>
  <div
    class="bs-cell"
    v-bind:title="content"
    v-bind:style="{ width: (size * ratio) + 'px', height: size + 'px' }"
    v-on:click="handleClick"
  >
    <BSIcon
      v-for="(icon, index) in icons"
      v-bind:key="index"
      v-bind:content="icon"
      v-bind:size="size"
      v-bind:index="index"
      v-on:ratio="(ratio) => updateRatio(index, ratio)"
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
  data() {
    return {
      ratio: 1,
    };
  },
  computed: {
    icons() {
      if (!this.content) return [];
      return this.content.split('!~')
        .map(icon => icon.trim())
        .filter(icon => !!icon);
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
    updateRatio(index, ratio) {
      if (index != 0) return;
      this.ratio = ratio;
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
