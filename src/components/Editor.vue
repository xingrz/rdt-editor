<template>
  <AceEditor
    class="editor"
    mode="rdt"
    theme="tomorrow"
    width="100%"
    height="100vh"
    v-bind:name="name"
    v-bind:value="content"
    v-bind:onBeforeLoad="onBeforeLoad"
    v-bind:onChange="onChange"
    v-bind:onScroll="onScroll"
    v-bind:onSelectionChange="onSelectionChange"
    v-bind:style="{
      lineHeight: `${size}px`,
    }"
    v-bind:editorProps="{
      $blockScrolling: Infinity,
    }"
    v-bind:setOptions="{
      enableLiveAutocompletion: [{ getCompletions, getDocTooltip }],
    }"
  />
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

import brace, {
  Selection,
  Range,
  Position,
  IEditSession,
  Editor as IEditor,
  VirtualRenderer,
} from "brace";
import "brace/theme/tomorrow";
import "@/editor/rdt";

import { RootState } from "@/store/types";
import IIcon from "@/types/icon";
import ISelection from "@/types/selection";

import { Ace as AceEditor } from "vue2-brace-editor";

interface IRenderer extends VirtualRenderer {
  scrollTop: number;
  scrollSelectionIntoView(): void;
}

@Component({
  components: {
    AceEditor,
  },
})
export default class Editor extends Vue {
  @Prop(Number) size!: number;
  @Prop(Number) scroll!: number;
  @Prop(Number) width!: number;
  @Prop(Object) selection!: ISelection | null;

  @State(({ icon }: RootState) => icon.icons)
  icons!: Record<string, IIcon | null>;

  @State(({ editor }: RootState) => editor.content)
  content!: string;

  name = "rdt-editor";

  editor!: IEditor;
  renderer!: IRenderer;

  @Mutation("save") save!: (content: string) => void;
  @Mutation("setScroll") setScroll!: (scroll: number) => void;
  @Mutation("setSelection") setSelection!: (
    selection: ISelection | null
  ) => void;

  mounted(): void {
    window.addEventListener("resize", this.handleResize);
  }

  beforeDestroy(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  @Watch("width")
  onWidthChanged(): void {
    this.handleResize();
  }

  @Watch("scroll")
  onScrollChanged(scroll: number): void {
    this.renderer.scrollToY(scroll);
  }

  @Watch("selection")
  onSelectionChanged({ row, offset, length, from }: ISelection): void {
    if (from != "editor") {
      const { selection } = this.editor.getSession();
      selection.setRange(
        {
          start: { row: row, column: offset },
          end: { row: row, column: offset + length },
        } as Range,
        false
      );
      this.renderer.scrollToX(0);
      this.renderer.scrollSelectionIntoView();
      this.editor.focus();
    }
  }

  onBeforeLoad(): void {
    this.editor = brace.edit(this.name);
    this.renderer = this.editor.renderer as IRenderer;
  }

  onChange(content: string): void {
    this.save(content);
  }

  onScroll(): void {
    this.setScroll(this.renderer.scrollTop);
  }

  onSelectionChange(selection: Selection): void {
    const { start } = selection.getRange();
    this.setSelection({
      row: start.row,
      offset: start.column,
      length: 0,
      from: "editor",
    });
  }

  handleResize(): void {
    this.editor.resize();
  }

  getCompletions(
    editor: IEditor,
    session: IEditSession,
    pos: Position,
    prefix: string,
    callback: (err: Error | null, completions?: { value: string }[]) => void
  ): void {
    callback(
      null,
      Object.keys(this.icons)
        .filter((icon) => !!this.icons[icon])
        .map((icon) => ({ value: icon }))
    );
  }

  getDocTooltip(item: { value: string; docHTML: string }): void {
    item.docHTML = `<img src="${
      this.icons[item.value]?.data
    }" class="preview" />`;
  }
}
</script>

<style>
.preview {
  height: 120px;
  display: block;
}
</style>
