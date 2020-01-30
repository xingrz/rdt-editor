const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
      new BundleAnalyzerPlugin(),
    ],
  },
};
