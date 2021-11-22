/*
 * @Author: 韩玉凯
 * @Date: 2020-04-20 14:24:03
 * @LastEditors: 韩玉凯
 * @LastEditTime: 2020-07-02 17:06:56
 * @FilePath: /mcommon/rollup.config.js
 */
// import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss'
import { eslint } from 'rollup-plugin-eslint'
import createBanner from 'create-banner'
import changeCase from 'change-case'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import codeframe from 'eslint/lib/cli-engine/formatters/codeframe'
import { terser } from 'rollup-plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const resolve = (p) => path.resolve(__dirname, p)
const pkg = require('./package')

const name = changeCase.pascalCase(pkg.name)
const banner = createBanner({
  data: {
    name: `${name}.js`,
    year: '2020-present'
  }
})
process.env.NODE_ENV = 'production'
export default {
  input: 'src/index.ts',
  output: [
    {
      banner,
      file: 'dist/index.js',
      format: 'umd',
      name: 'generalForm',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes'
      }
    },
    {
      file: 'dist/index.cjs.js',
      banner,
      format: 'cjs'
    },
    {
      file: 'dist/index.es.js',
      banner,
      format: 'esm'
    }
  ],
  cache: true,
  external: ['react', 'prop-types'],
  plugins: [
    eslint({
      cache: true,
      fix: true,
      include: [path.join(__dirname, '/src/')],
      formatter: codeframe
    }),
    nodeResolve(),
    commonjs(),
    ts({
      check: true,
      tsconfig: resolve('tsconfig.json'),
      cacheRoot: resolve('node_modules/.rts2_cache')
    }),
    scss({ output: 'dist/index.css' }),
    terser()
  ]
}
