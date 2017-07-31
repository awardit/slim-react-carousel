const uglify       = require("rollup-plugin-uglify");
const strip        = require("rollup-plugin-strip");
const gzip         = require("rollup-plugin-gzip");
const minify       = require("uglify-js").minify;
const replace      = require('rollup-plugin-replace');

const sharedConfig = require("./rollup.config.shared");

// TODO: add uglification

module.exports = Object.assign(sharedConfig, {
  entry:  'src/index.js',
  targets: [
    {
      dest:   'dist/index.es2015.js',
      format: 'es',
    },
    {
      dest:   'dist/index.cjs.js',
      format: 'cjs',
    },
    {
      dest:       'dist/index.js',
      format:     'iife',
      moduleName: 'slimReactCarousel',
    },
  ],
  plugins: sharedConfig.plugins.slice().concat([
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    /*
    strip(),
    gzip({
      options: {
        level: 9
      }
    })
    */
  ]),
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
  external: [
    "react",
    "prop-types"
  ]
});
