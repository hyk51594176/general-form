import { defineConfig } from 'dumi';

export default defineConfig({
  base: '/general-form/',
  outputPath: '../docs',
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
  extraBabelPlugins: [['import', { libraryName: 'antd', style: true }]],
});
