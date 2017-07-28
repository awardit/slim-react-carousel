const babel        = require("rollup-plugin-babel");
const commonjs     = require('rollup-plugin-commonjs');
const resolve      = require("rollup-plugin-node-resolve");
const localResolve = require("rollup-plugin-local-resolve");

module.exports = {
  format: 'es',
  plugins: [
    commonjs({
      include: [
        'node_modules/**'
      ],
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    babel(),
    localResolve(),
    resolve()
  ]
};
