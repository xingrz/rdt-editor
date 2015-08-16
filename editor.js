$(function () {
  var $preview = $('#preview')
    , $editor = $('#editor')

  function render () {
    var content = $editor.val()
    localStorage.setItem('content', content)

    var maxLength = 0

    var rendered = content.split('\n').map(function (row, i) {
      var rows = row.replace(/~~.+$/, '').split('\\')
      if (rows.length > maxLength) {
        maxLength = rows.length
      }
      return '<div>' + rows.map(function (cell, j) {
        return '<div data-row="' + i + '" data-cell="' + j + '">' + cell.split('!~').map(function (layer) {
          layer = layer.trim()
          if (layer) {
            var name = 'BSicon_' + (layer.replace(/ /, '_')) + '.svg'
              , hash = CryptoJS.MD5(name).toString(CryptoJS.enc.Hex)
              , file = hash.substring(0, 1) + '/' + hash.substring(0, 2) + '/' + encodeURIComponent(name) + '/40px-' + encodeURIComponent(name) + '.png'
            return '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/' + file + '">'
          }
        }).join('') + '</div>'
      }).join('') + '</div>'
    }).join('')

    $preview.css('width', maxLength * 20).html(rendered)

    var width = maxLength * 20 + 80
    width = width < 200 ? 200 : width
    width = width > 600 ? 600 : width

    $('#preview-container').css('width', width)
    $('#editor-container').css('right', width)
  }

  function syncFocus () {
    var selection = $editor.prop('selectionStart')

    var rows = $editor.val().substring(0, selection).split('\n')

    var row = rows.length - 1
      , cell = rows.pop().split('\\').length - 1

    $preview.find('.focus').removeClass('focus')
    $preview.find('> div > div[data-row="' + row + '"][data-cell="' + cell + '"]').addClass('focus')
  }

  $preview.on('click', '> div > div[data-row][data-cell]', function () {
    var $this = $(this)

    var row = $this.data('row')
      , cell = $this.data('cell')

    var rows = $editor.val().split('\n').slice(0, row + 1)
      , cells = rows.pop().split('\\').slice(0, cell + 1)

    var above = rows.join('\n').length
    above = rows.length ? above + 1 : 0

    var selection = cells.pop()

    var cell = cells.join('\\').length
    cell = cells.length ? cell + 1 : 0

    var selectionStart = above + cell
      , selectionEnd = selectionStart + selection.length

    $editor
      .prop('selectionStart', selectionStart)
      .prop('selectionEnd', selectionEnd)
      .focus()

    $preview.find('.focus').removeClass('focus')
    $this.addClass('focus')
  })

  $editor.on('keyup', $.debounce(250, function () {
    localStorage.setItem('content', $editor.val())
    render()
    syncFocus()
  }))

  $editor.on('mouseup', function () {
    syncFocus()
  })

  $editor.val(localStorage.getItem('content'))
  render()
})
