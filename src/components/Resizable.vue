<template>
  <div
    class="resizable"
    v-bind:class="{ resizing: resizing }"
    v-on:mousemove="onResizeMove"
    v-on:mouseup="onResizeEnd"
  >
    <div class="main">
      <slot></slot>
    </div>
    <div class="resizer" v-on:mousedown="onResizeStart"></div>
    <div v-bind:style="{ width: `${width || 200}px` }">
      <slot name="fixed"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Resizable extends Vue {
  @Prop(Number) width!: number;

  resizing = false;
  clientX = 0;

  onResizeStart(evt: MouseEvent): void {
    this.resizing = true;
    this.clientX = evt.clientX;
    this.$emit("resizeStart");
  }

  onResizeMove(evt: MouseEvent): void {
    if (this.resizing) {
      this.$emit("resize", this.width - (evt.clientX - this.clientX));
      this.clientX = evt.clientX;
    }
  }

  onResizeEnd(): void {
    if (this.resizing) {
      this.resizing = false;
      this.$emit("resizeEnd");
    }
  }
}
</script>

<style>
.resizable {
  display: flex;
  align-items: stretch;
}

.resizable > .main {
  flex: 1;
}

.resizable > .resizer {
  width: 8px;
  cursor: col-resize;
  background: #ccc;
}

.resizable.resizing > .resizer {
  background: #bbb;
}
</style>
