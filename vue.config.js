const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({
        languages: [],
        features: [
          'clipboard', 'contextmenu', 'cursorUndo', 'hover',
          'smartSelect', 'suggest'
        ],
      }),
    ],
  },
};
