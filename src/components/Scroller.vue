<template>
  <div class="scroller" @scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: { scroll: { twoWay: true } },
  watch: {
    scroll (value) {
      this.$el.scrollTop = value
    }
  },
  methods: {
    onScroll () {
      this.scroll = this.$el.scrollTop
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
