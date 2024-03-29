import { defineConfig } from 'dumi';
import path from 'path'
export default defineConfig({
  base: '/general-form/',
  outputPath: 'docs-dist',
  title: '@hanyk/general-form',
  mode: 'site',
  publicPath: process.env.NODE_ENV === 'production' ? '/general-form/' : '/',
  navs: [
    {
      title: '使用文档',
      path: '/docs',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/hyk51594176/general-form',
    },
  ],
  alias: {
    '@hanyk/general-form': path.join(__dirname, 'src')
  },
  sass: {
    implementation: require('sass'),
  }
});
