const prodPlugins = []
// 判断是否属于生产环境
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 如果是生产环境就添加transform-remove-console插件
    ...prodPlugins
  ],

}