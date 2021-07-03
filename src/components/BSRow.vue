<template>
  <div class="bs-row">
    <div class="cells" v-bind:style="{ flexBasis: `${iconWidth}px` }">
      <BSCell
        class="selection"
        v-for="({ cell, offset }, index) in cells"
        v-bind:key="index"
        v-bind:class="{ focused: isFocused(row, offset, cell.length) }"
        v-bind:content="cell"
        v-bind:size="size"
        v-bind:row="row"
        v-bind:offset="offset"
      />
    </div>
    <div class="texts" v-bind:style="{ maxWidth: `${textMaxWidth}px` }">
      <BSText
        class="selection"
        v-for="({ text, offset, align }, index) in texts"
        v-bind:key="index"
        v-bind:class="{ focused: isFocused(row, offset, text.length) }"
        v-bind:content="text"
        v-bind:align="align"
        v-bind:row="row"
        v-bind:offset="offset"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State } from "vuex-class";

import { RootState } from "@/store/types";
import ISelection from "@/types/selection";

import BSCell from "./BSCell.vue";
import BSText from "./BSText.vue";

@Component({
  components: {
    BSCell,
    BSText,
  },
})
export default class BSRow extends Vue {
  @Prop(String) content!: string;
  @Prop(Number) cols!: number;
  @Prop(Number) size!: number;
  @Prop(Number) width!: number;
  @Prop(Number) row!: number;

  @State(({ editor }: RootState) => editor.selection)
  selection!: ISelection | null;

  get parts(): { part: string; offset: number }[] {
    let offset = 0;
    return this.content.split("~~").map((part) => {
      const o = offset;
      offset += part.length + 2;
      return { part, offset: o };
    });
  }

  get cells(): { cell: string; offset: number }[] {
    let offset = 0;
    return this.parts[0].part.split("\\").map((cell) => {
      const o = offset;
      offset += cell.length + 1;
      return { cell, offset: o };
    });
  }

  get texts(): { text: string; offset: number; align: number }[] {
    return this.parts
      .slice(1)
      .map(({ part, offset }, i) => ({ text: part, offset, align: i + 1 }))
      .filter(({ text }) => text && text.trim());
  }

  get iconWidth(): number {
    return this.size * this.cols;
  }

  get textMaxWidth(): number {
    return this.width - this.iconWidth;
  }

  isFocused(row: number, offset: number, length: number): boolean {
    return (
      this.selection != null &&
      this.selection.row == row &&
      this.selection.offset >= offset &&
      this.selection.offset <= offset + length
    );
  }
}
</script>

<style>
.bs-row {
  display: flex;
  align-items: stretch;
}

.bs-row > .cells {
  display: flex;
  justify-content: center;
}

.bs-row > .texts {
  flex-grow: 1;
  flex-shrink: 1000;
  display: flex;
}

.bs-row .selection {
  position: relative;
}

.bs-row .selection::after {
  display: block;
  content: "";

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: #0099ff;
  opacity: 0;

  transition: opacity 200ms;
}

.bs-row .selection:hover::after {
  opacity: 0.2;
}

.bs-row .selection.focused::after {
  opacity: 0.3;
}
</style>
