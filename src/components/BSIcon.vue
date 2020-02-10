<template>
  <div
    class="bs-label"
    v-if="label"
    v-bind:data-bold="label.params.b || label.params.bold"
    v-bind:data-align="(label.params.align || '').toUpperCase()"
    v-bind:style="{
      width: (size * ratio) + 'px',
      height: size + 'px',
      fontSize: (size - 8) + 'px',
    }"
  ><span>{{label.text}}</span></div>
  <img
    class="bs-icon"
    v-else
    v-bind:style="{
      width: (size * ratio) + 'px',
      height: size + 'px',
    }"
    v-bind:src="content ? $store.state.icon.data[content] : null"
  />
</template>

<script>
import qs from 'querystring';

function selectTextWidth(flag) {
  switch (flag) {
    case 'o': return 0.125;
    case 'c': return 0.25;
    case 'd': return 0.5;
    case 'b': return 2;
    case 's': return 4;
    case 'w': return 8;
  }
}

function parseTextParams(str) {
  return qs.parse(str, ',', '=', {
    decodeURIComponent: (s) => s,
  });
}

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
    ratio(ratio) {
      this.$emit('ratio', ratio);
    },
  },
  computed: {
    label() {
      if (this.content && this.content.match(/^(.*)\*([^_]+)(__(.+)$)?/)) {
        const ratio = selectTextWidth(RegExp.$1);
        const text = RegExp.$2;
        const params = parseTextParams(RegExp.$4 || '');
        return { text, ratio, params };
      } else {
        return null;
      }
    },
    ratio() {
      if (!this.content) return 1;
      if (this.label) {
        return this.label.ratio || 1;
      } else {
        return this.$store.state.icon.ratio[this.content] || 1;
      }
    },
  },
  created() {
    if (this.content && !this.label) {
      this.$store.dispatch('fetch', this.content);
    }
    this.$emit('ratio', this.ratio);
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
  text-align: center;
}

.bs-label span {
  line-height: 0.75;
}

.bs-label[data-align="L"] {
  text-align: left;
}

.bs-label[data-align="R"] {
  text-align: right;
}

.bs-label[data-align="A"] span {
  vertical-align: top;
}

.bs-label[data-align="E"] span {
  vertical-align: bottom;
}

.bs-label[data-bold="1"] {
  font-weight: bold;
}
</style>
