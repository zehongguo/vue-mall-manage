import axios from 'axios';

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://119.23.53.78:8888/api/private/v1/',
    timeout: 5000
  });

  // 拦截发送请求
  instance.interceptors.request.use(config => {
    return config;
  }, err => {
    console.log('发送请求失败' + err);
  });

  // 拦截响应
  instance.interceptors.response.use(res => {
    return res.data;
  }, err => {
    console.log("响应失败" + err);
  });

  return instance(config);
}