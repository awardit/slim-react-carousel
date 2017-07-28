const replace = require('rollup-plugin-replace');

const sharedConfig = require("./rollup.config.shared");

module.exports = Object.assign(sharedConfig, {
  entry: 'example/example.js',
  plugins: sharedConfig.plugins.slice().concat([
    replace({
      "process.env.NODE_ENV": JSON.stringify("dev")
    })
  ]),
  dest: 'example/dist/index.js'
});
