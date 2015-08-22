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
        , cols = rows.pop().split('\\')
        , cell = cols.pop()
        , text = cell + this.source.substring(selection).split('\n').shift()

      var row = rows.length
        , col = cols.length

      $('.preview').find('.focus').removeClass('focus')

      var divider = text.indexOf('~~')
        , leading = cell.length

      if ((divider == 0 && leading >= 1) || (divider > 0 && leading > divider)) {
        $('.preview').find('> div[data-row="' + row + '"] > .text').addClass('focus')
      } else {
        $('.preview').find('> div[data-row="' + row + '"] > .cell[data-col="' + col + '"]').addClass('focus')
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
      var divider = this.source.indexOf('~~')
      if (divider > 0) {
        return {
          cols: this.source.substring(0, divider).split('\\'),
          text: this.source.substring(divider).trim()
        }
      } else {
        return {
          cols: this.source.split('\\')
        }
      }
    }
  },
  methods: {
    select: function (e) {
      // TODO: 这部分代码十分傻逼，等我学完 Vue 之后再重构

      var row = $(this.$el).data('row')

      var rows = this.$root.$children[0].source.split('\n').slice(0, row + 1)
        , line = rows.pop()

      var above = rows.join('\n').length
      above = rows.length ? above + 1 : 0

      var divider = line.lastIndexOf('~~')

      var selectionStart = above
        , selectionEnd = selectionStart + line.length

      if (divider > 0) {
        selectionStart += divider + 2
      } else {
        selectionStart += line.length
      }

      this.$root.$children[0].selectionStart = selectionStart
      this.$root.$children[0].selectionEnd = selectionEnd
      $('.editor').focus()
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

      var row = $(this.$el).parent('[data-row]').data('row')
        , col = $(this.$el).data('col')

      var rows = this.$root.$children[0].source.split('\n').slice(0, row + 1)
        , cols = rows.pop().split('\\').slice(0, col + 1)

      var above = rows.join('\n').length
      above = rows.length ? above + 1 : 0

      var selection = cols.pop()

      var divider = selection.indexOf('~~')
      if (divider >= 0) {
        selection = selection.substring(0, divider)
      }

      var col = cols.join('\\').length
      col = cols.length ? col + 1 : 0

      var selectionStart = above + col
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
  },
  methods: {
    onError: function (e) {
      console.log('on error', e)
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