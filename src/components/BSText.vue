<template>
  <div
    class="bs-text"
    v-bind:class="`text-${align}`"
    v-bind:title="content"
    v-on:click="handleClick"
  >
    {{ content }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-class";

import ISelection from "@/types/selection";

@Component
export default class BSText extends Vue {
  @Prop(String) content!: string;
  @Prop(Number) align!: number;
  @Prop(Number) row!: number;
  @Prop(Number) offset!: number;

  @Mutation("setSelection") setSelection!: (
    selection: ISelection | null
  ) => void;

  handleClick(): void {
    this.setSelection({
      row: this.row,
      offset: this.offset,
      length: this.content.length,
      from: "preview",
    });
  }
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
