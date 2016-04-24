Vue.directive('selection', {
  twoWay: true,
  bind: function () {
    this.handler = function () {
      switch (this.arg) {
        case 'start':
          this.set(this.el.selectionStart)
          break
        case 'end':
          this.set(this.el.selectionEnd)
          break
      }
    }.bind(this)
    this.el.addEventListener('keyup', this.handler, false)
    this.el.addEventListener('mouseup', this.handler, false)
  },
  update: function (value) {
    switch (this.arg) {
      case 'start':
        this.el.selectionStart = value
        break
      case 'end':
        this.el.selectionEnd = value
        break
    }
  },
  unbind: function () {
    this.el.removeEventListener('keyup', this.handler)
    this.el.removeEventListener('mouseup', this.handler)
  }
})

Vue.component('editor', {
  name: 'editor',
  props: [ 'source' ],
  template: '#editor-template',
  data: function () {
    return {
      selectionStart: 0,
      selectionEnd: 0
    }
  },
  computed: {
    width: function () {
      var maxLength = 0
      this.source.split('\n').forEach(function (row, i) {
        maxLength = Math.max(maxLength, row.split('\\').length)
      })
      return Math.min(Math.max(maxLength * 20 + 80 + 200, 200), 600)
    }
  },
  watch: {
    selectionStart: function (selection) {
      // TODO: 这部分代码十分傻逼，等我学完 Vue 之后再重构

      var rows = this.source.substring(0, selection).split('\n')

      var line = rows.pop()

      var cols = line.split('\\')
        , texts = line.split('~~')

      var cell = cols.pop()
        , text = cell + this.source.substring(selection).split('\n').shift()

      var row = rows.length
        , col = cols.length
        , index

      if (text.split('~~').length == 2 && texts.length == 2) {
        index = 2
      } else {
        index = texts.length - 1
      }

      $('.preview').find('.focus').removeClass('focus')

      if (index > 0) {
        $('.preview').find('> div[data-row="' + row + '"] > .texts > div[data-index="' + index + '"]').addClass('focus')
      } else {
        $('.preview').find('> div[data-row="' + row + '"] > .cells > div[data-col="' + col + '"]').addClass('focus')
      }
    }
  }
})

Vue.component('preview', {
  name: 'preview',
  props: [ 'source' ],
  template: '#preview-template',
  computed: {
    rows: function () {
      return this.source.split('\n')
    }
  }
})

Vue.component('row', {
  name: 'row',
  props: [ 'source' ],
  template: '#row-template',
  computed: {
    row: function () {
      var texts = this.source.split('~~')
        , cols = texts.shift().split('\\')

      if (texts.length == 1) {
        texts = texts.map(function (text) {
          return {
            text: text.trim(),
            index: 2
          }
        })
      } else {
        texts = texts.map(function (text, index) {
          return {
            text: text.trim(),
            index: index + 1
          }
        }).filter(function (text) {
          return !!text.text
        })
      }

      return {
        cols: cols,
        texts: texts
      }
    }
  }
})

Vue.component('col', {
  name: 'col',
  props: [ 'source' ],
  template: '#col-template',
  computed: {
    col: function () {
      return {
        icons: this.source.trim()
          ? this.source.split('!~').map(function (icon) {
              return icon.trim()
            })
          : []
      }
    }
  },
  methods: {
    select: function () {
      // TODO: 这部分代码十分傻逼，等我学完 Vue 之后再重构

      var row = $(this.$el).parents('[data-row]').data('row')
        , col = $(this.$el).data('col')

      var rows = this.$root.source.split('\n').slice(0, row + 1)
        , cols = rows.pop().split('\\').slice(0, col + 1)

      var above = rows.join('\n').length
      above = rows.length ? above + 1 : 0

      var selection = cols.pop()

      var divider = selection.indexOf('~~')
      if (divider >= 0) {
        selection = selection.substring(0, divider)
      }

      var start = cols.join('\\').length
      start = cols.length ? start + 1 : 0

      var selectionStart = above + start
        , selectionEnd = selectionStart + selection.length

      this.$root.$children[0].selectionStart = selectionStart
      this.$root.$children[0].selectionEnd = selectionEnd
      $('.editor').focus()
    }
  }
})

Vue.component('icon', {
  name: 'icon',
  props: [ 'name' ],
  template: '#icon-template',
  computed: {
    file: function () {
      return 'BSicon_' + this.name.replace(/ /, '_') + '.svg'
    },
    hash: function () {
      return CryptoJS.MD5(this.file).toString(CryptoJS.enc.Hex)
    },
    url: function () {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/'
            + this.hash.substring(0, 1) + '/'
            + this.hash.substring(0, 2) + '/'
            + encodeURIComponent(this.file) + '/'
            + '40px-' + encodeURIComponent(this.file) + '.png'
    }
  }
})

Vue.component('text', {
  name: 'text',
  props: [ 'text', 'index' ],
  template: '#text-template',
  methods: {
    select: function (e) {
      // TODO: 这部分代码十分傻逼，等我学完 Vue 之后再重构

      var row = $(this.$el).parents('[data-row]').data('row')
        , index = $(this.$el).data('index')

      console.log(index)

      var rows = this.$root.source.split('\n').slice(0, row + 1)
        , texts = rows.pop().split('~~')

      if (texts.length > 2) {
        texts = texts.slice(0, index + 1)
      }

      var above = rows.join('\n').length
      above = rows.length ? above + 1 : 0

      var selection = texts.pop()

      var start = texts.join('~~').length + 2

      var selectionStart = above + start
        , selectionEnd = selectionStart + selection.length

      this.$root.$children[0].selectionStart = selectionStart
      this.$root.$children[0].selectionEnd = selectionEnd
      $('.editor').focus()
    }
  }
})

new Vue({
  el: '#editor',
  data: {
    source: localStorage.getItem('content')
  },
  watch: {
    source: function (value) {
      localStorage.setItem('content', value)
    }
  }
})
