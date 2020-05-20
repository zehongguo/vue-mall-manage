const path = require('path'); //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}


module.exports = {

  chainWebpack: (config) => {
    config.resolve.alias
      //set第一个参数：设置的别名，第二个参数：设置的路径
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('assets', resolve('./src/assets'))
      .set('views', resolve('./src/views'))
      .set('network', resolve('./src/network'))
      .set('util', resolve('./src/util'));
    //注意 store 和 router 没必要配置
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue', // 'import Vue(变量名) from vue(包名)'
        'vue-router': 'VueRouter', // 'import VueRouter from vue-router'
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin("html").tap(args => {
        args[0].isProd = true
        return args
      })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.set('externals', {
        'vue-router': 'VueRouter',
      })
      config.plugin("html").tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
};