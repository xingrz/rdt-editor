<template>
  <img
    class="bs-icon"
    v-bind:style="{ width: size + 'px', height: size + 'px' }"
    v-bind:src="url"
  />
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'BSIcon',
  props: {
    content: String,
    size: Number,
  },
  computed: {
    url() {
      const file = `BSicon_${this.content.replace(/ /, '_')}.svg`;
      const hash = CryptoJS.MD5(file).toString(CryptoJS.enc.Hex);
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb'
      + `/${hash.substring(0, 1)}/${hash.substring(0, 2)}`
      + `/${encodeURIComponent(file)}`
      + `/40px-${encodeURIComponent(file)}.png`
    },
  },
}
</script>

<style>
.bs-icon {
  position: absolute;
  user-select: none;
}
</style>
