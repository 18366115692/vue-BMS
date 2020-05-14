// 这是项目发布阶段需要用到的 bable 插件
const profPlugins = []
if (process.env.NODE_ENV === 'production') {
  profPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...profPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
