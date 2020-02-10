<template>
  <div
    class="bs-label"
    v-if="label"
    v-bind:style="{
      width: size + 'px',
      height: size + 'px',
      textAlign: label.align,
      lineHeight: size + 'px',
      fontSize: (size - 8) + 'px',
    }"
  >{{label.text}}</div>
  <img
    class="bs-icon"
    v-else
    v-bind:style="{ width: width + 'px', height: size + 'px' }"
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
    width() {
      if (!this.content) return this.size;
      const ratio = this.$store.state.icon.ratio[this.content] || 1;
      return this.size * ratio;
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
}
</style>
