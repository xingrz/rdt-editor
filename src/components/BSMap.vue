<template>
  <div class="bs-map" v-bind:style="{ lineHeight: `${size}px` }">
    <BSRow
      v-for="(row, index) in rows"
      v-bind:key="index"
      v-bind:content="row"
      v-bind:cols="cols"
      v-bind:size="size"
      v-bind:width="width"
      v-bind:row="index"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import BSRow from "./BSRow.vue";

@Component({
  components: {
    BSRow,
  },
})
export default class BSMap extends Vue {
  @Prop(String) content!: string;
  @Prop(Number) size!: number;
  @Prop(Number) width!: number;

  get rows(): string[] {
    return this.content.split("\n");
  }

  get cols(): number {
    let cols = 0;
    for (let row of this.rows) {
      const c = Math.max(cols, row.split("\\").length);
      if (c > cols) cols = c;
    }
    return cols;
  }
}
</script>

<style>
</style>
