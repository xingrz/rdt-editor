<template>
  <div class="bs-cell" v-bind:style="{ width: size + 'px', height: size + 'px' }">
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
  },
  computed: {
    icons() {
      return this.content.split('!~');
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
