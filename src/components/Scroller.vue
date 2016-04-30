<template>
  <div class="scroller" @scroll="scroll">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [ 'offset' ],
  watch: {
    offset (value) {
      this.$el.scrollTop = value
    }
  },
  methods: {
    scroll () {
      this.$dispatch('scrolly', this.$el.scrollTop)
    }
  }
}
</script>

<style lang="sass" scoped>
.scroller {
  overflow: scroll;

  > * {
    min-width: max-content;
  }
}
</style>
