<template>
  <div class="scroller" v-on:scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Mutation } from "vuex-class";

@Component
export default class Scroller extends Vue {
  @Prop(Number) scroll!: number;

  @Mutation("setScroll") setScroll!: (scroll: number) => void;

  @Watch("scroll")
  onScrollChanged(scroll: number): void {
    this.$el.scrollTop = scroll;
  }

  onScroll(): void {
    this.setScroll(this.$el.scrollTop);
  }
}
</script>

<style>
.scroller {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: #f9f9f9;
}
</style>
