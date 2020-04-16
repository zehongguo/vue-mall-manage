import axios from 'axios';
import {
  Message
} from 'element-ui';

export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://119.23.53.78:8888/api/private/v1/',
    // baseURL: 'http://47.115.124.102:8888/api/private/v1',
    baseURL: 'http://106.12.11.162:8888/api/private/v1/',

    timeout: 5000
  });

  // 拦截发送请求
  instance.interceptors.request.use(config => {
    // 头部信息添加token信息
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
  }, err => {
    Message.error("发送请求失败");
    console.log('发送请求失败' + err);
  });

  // 拦截响应
  instance.interceptors.response.use(res => {
    return res.data;
  }, err => {
    Message.error("响应超时");
    console.log("响应失败" + err);
  });

  return instance(config);
}