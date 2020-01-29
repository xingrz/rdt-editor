<template>
  <div class="resizable" v-bind:class="{resizing: resizing}" v-on:mousemove="onResizeMove" v-on:mouseup="onResizeEnd">
    <div class="main">
      <slot></slot>
    </div>
    <div class="resizer" v-on:mousedown="onResizeStart"></div>
    <div v-bind:style="{ width: (width || 200) + 'px' }">
      <slot name="fixed"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Resizable',
  props: {
    width: Number,
  },
  data() {
    return {
      resizing: false,
      clientX: 0,
    };
  },
  methods: {
    onResizeStart(evt) {
      this.resizing = true;
      this.clientX = evt.clientX;
      this.$emit('resizeStart');
    },
    onResizeMove(evt) {
      if (this.resizing) {
        this.$emit('resize', this.width - (evt.clientX - this.clientX));
        this.clientX = evt.clientX;
      }
    },
    onResizeEnd() {
      if (this.resizing) {
        this.resizing = false;
        this.$emit('resizeEnd');
      }
    },
  },
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
  background: #CCC;
}

.resizable.resizing > .resizer {
  background: #BBB;
}
</style>
