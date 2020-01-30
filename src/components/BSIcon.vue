<template>
  <div
    class="bs-label"
    v-if="label"
    v-bind:style="{ ...sizeStyle, textAlign: label.align, lineHeight: size + 'px' }"
  >{{label.text}}</div>
  <img
    class="bs-icon"
    v-else
    v-bind:style="{ ...sizeStyle }"
    v-bind:src="content ? $store.state.icon.data[content] : null"
  />
</template>

<script>
export default {
  name: 'BSIcon',
  props: {
    content: String,
    size: Number,
  },
  watch: {
    content(content) {
      if (!this.label) {
        this.$store.dispatch('fetch', content);
      }
    },
  },
  computed: {
    sizeStyle() {
      return { width: this.size + 'px', height: this.size + 'px' };
    },
    label() {
      if (this.content && this.content.match(/^\*([^_]+)(__align=(l|m|r|L|M|R)$)?/)) {
        const text = RegExp.$1;
        const align = ((align) => {
          switch (align) {
            case 'l':
            case 'L': return 'left';
            case 'r':
            case 'R': return 'right';
             default: return 'center';
          }
        })(RegExp.$3);
        return { text, align };
      } else {
        return null;
      }
    },
  },
  created() {
    if (this.content && !this.label) {
      this.$store.dispatch('fetch', this.content);
    }
  },
}
</script>

<style>
.bs-icon {
  position: absolute;
  user-select: none;
}

.bs-label {
  position: absolute;
  user-select: none;
  font-family: monospace;
  font-size: 12px;
}
</style>
