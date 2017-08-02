const fs           = require("fs");
const babel        = require("rollup-plugin-babel");
const commonjs     = require('rollup-plugin-commonjs');
const resolve      = require("rollup-plugin-node-resolve");
const localResolve = require("rollup-plugin-local-resolve");

const babelrc      = JSON.parse(fs.readFileSync("./.babelrc").toString("utf8"));

module.exports = {
  format: 'es',
  plugins: [
    commonjs({
      include: [
        'node_modules/**'
      ],
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement', 'cloneElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    babel(Object.assign(babelrc, {
      babelrc: false,
      presets: [
        "es2015-rollup"
      ]
    })),
    localResolve(),
    resolve()
  ]
};
