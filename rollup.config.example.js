const replace    = require('rollup-plugin-replace');
const serve      = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');

const sharedConfig = require("./rollup.config.shared");

module.exports = Object.assign(sharedConfig, {
  entry: 'example/index.js',
  plugins: sharedConfig.plugins.slice().concat([
    replace({
      "process.env.NODE_ENV": JSON.stringify("dev")
    }),
    serve('example'),
    livereload()
  ]),
  dest: 'example/dist/index.js'
});
