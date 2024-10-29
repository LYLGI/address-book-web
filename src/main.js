import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
import axios from 'axios';
Vue.config.productionTip = false

// 全局配置 Axios 基础 URL
axios.defaults.baseURL = 'http://localhost:8080';

new Vue({
  render: h => h(App),
}).$mount('#app')
