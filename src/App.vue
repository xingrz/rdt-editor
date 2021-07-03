<template>
  <div id="app">
    <Resizable v-bind:width="width" v-on:resize="handleResize">
      <template v-slot:default>
        <Editor
          v-bind:size="editor.size"
          v-bind:scroll="editor.scroll"
          v-bind:width="width"
          v-bind:selection="editor.selection"
        />
      </template>
      <template v-slot:fixed>
        <Scroller v-bind:scroll="editor.scroll">
          <BSMap
            v-bind:content="editor.content"
            v-bind:size="editor.size"
            v-bind:width="width"
          />
        </Scroller>
      </template>
    </Resizable>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";

import { EditorState } from "@/store/types";

import Resizable from "./components/Resizable.vue";
import Scroller from "./components/Scroller.vue";
import BSMap from "./components/BSMap.vue";
import Editor from "./components/Editor.vue";

@Component({
  components: {
    Resizable,
    Scroller,
    BSMap,
    Editor,
  },
})
export default class App extends Vue {
  @State("editor") editor!: EditorState;

  @Mutation("setWidth") setWidth!: (scroll: number) => void;

  get width(): number {
    const max = window.innerWidth - 200;
    const min = 200;
    const width = this.editor.width;
    return Math.max(Math.min(width, max), min);
  }

  handleResize(size: number): void {
    this.setWidth(size);
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overscroll-behavior-x: none;
}
</style>
