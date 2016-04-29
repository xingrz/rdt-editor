<template>
  <img class="icon" :src="url" />
</template>

<script>
export default {
  props: [ 'name' ],
  computed: {
    file () {
      return `BSicon_${this.name.replace(/ /, '_')}.svg`
    },
    hash () {
      return CryptoJS.MD5(this.file).toString(CryptoJS.enc.Hex)
    },
    url () {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb'
      + `/${this.hash.substring(0, 1)}/${this.hash.substring(0, 2)}`
      + `/${encodeURIComponent(this.file)}`
      + `/40px-${encodeURIComponent(this.file)}.png`
    }
  }
}
</script>

<style lang="sass" scoped>
.icon {
  display: block;
  position: absolute;

  width: 20px;
  height: 20px;

  margin: 0;
  padding: 0;

  border: none;
}
</style>
