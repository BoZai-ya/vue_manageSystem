import axios from "axios";
import Vue from "vue";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1";
axios.interceptors.request.use((config) => {
  // 为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // console.log(config);
  return config;
});
Vue.prototype.$axios = axios;
export default axios;
