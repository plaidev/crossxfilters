// rollup.config.umd.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import babel from 'rollup-plugin-babel'

export default {

  // entry
  input: 'src/index.mjs',

  // output
  output: {
    file: 'dist/index.js',
    name: 'Cross2Filters',
    format: 'umd'
  },

  sourcemap: true,

  plugins: [

    resolve({
      // ES moduleがあっても無視する
      module: false, // Default: true
      main: true,  // Default: true
    }),

    commonjs({
      // commonjsを使うのはnode_modulesの中だけ
      include: 'node_modules/**',  // Default: undefined
      extensions: [ '.js', '.mjs' ],  // Default: [ '.js' ]
    }),

    babel({

      // .babelrcを読まない
      babelrc: false,

      // node_modules以下は対象外
      exclude: 'node_modules/**',

      presets: [
        // es6 => es5
        ["es2015", { "modules": false }], 

        // stage-3 => es6
        "stage-3" 
      ],

      plugins: [
        // const {a='A', b='B'} = {a: 'AA'}
        // consle.log(a, b) // console: AA B
        // function f({a="A", b="B"}) { console.log(a, b) }
        // f({}) // A B
        // f({b: "BB"}) // A BB
        "transform-es2015-destructuring",

        // regenerator, asyncToGenerator, promise
        // 外部モジュールとしてbabel-runtimeから読み込む
        // package.jsonでdependenciesに'babel-runtime'の登録が必要
        "transform-runtime"
      ],

      // transform-runtimeを使う
      runtimeHelpers: true
    })

  ],

  // runtimeがcommonjsやbabelの影響を受けないようにする
  // external: (id) => id.indexOf("babel-runtime") === 0,

}
