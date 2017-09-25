// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import babel from 'rollup-plugin-babel'

export default {

  // entry
  input: 'src/index.mjs',

  // output
  output: {
    file: 'dist/index.mjs',
    format: 'es'
  },

  sourcemap: true,

  plugins: [

    resolve({
      module: true, // Default: true
      jsnext: true,  // Default: false
      main: true,  // Default: true
    }),

    commonjs({
      include: 'node_modules/**',  // Default: undefined
      extensions: [ '.mjs', '.js' ],  // Default: [ '.js' ]
    }),

    babel({
      babelrc: false,
      presets: [ // stage-3 => es6
        "stage-3"
      ],
      plugins: [
        "transform-es2015-destructuring",
        "external-helpers"
      ]
    })

  ]
}
