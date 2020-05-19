import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js';
import router from './route/index';
import 'default-passive-events'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false;
// 全局过滤器
Vue.filter("dataFormat", (originVal) => {
  const dt = new Date(originVal * 1000);
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1 + "").padStart(2, "0")
  let d = (dt.getDay() + "").padStart(2, "0")
  let hh = (dt.getHours() + "").padStart(2, "0")
  let mm = (dt.getMinutes() + "").padStart(2, "0")
  let ss = (dt.getSeconds() + "").padStart(2, "0")
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');