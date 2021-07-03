<template>
  <div
    class="bs-cell"
    v-bind:title="content"
    v-bind:style="{ width: `${size * ratio}px`, height: `${size}px` }"
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

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-class";

import ISelection from "@/types/selection";

import BSIcon from "./BSIcon.vue";

@Component({
  components: {
    BSIcon,
  },
})
export default class BSCell extends Vue {
  @Prop(String) content!: string;
  @Prop(Number) size!: number;
  @Prop(Number) row!: number;
  @Prop(Number) offset!: number;

  @Mutation("setSelection") setSelection!: (
    selection: ISelection | null
  ) => void;

  ratio = 1;

  get icons(): string[] {
    if (!this.content) return [];
    return this.content
      .split("!~")
      .map((icon) => icon.trim())
      .filter((icon) => !!icon);
  }

  handleClick(): void {
    this.setSelection({
      row: this.row,
      offset: this.offset,
      length: this.content.length,
      from: "preview",
    });
  }

  updateRatio(index: number, ratio: number): void {
    if (index != 0) return;
    this.ratio = ratio;
  }
}
</script>

<style>
.bs-cell {
  position: relative;
  cursor: pointer;
}
</style>
