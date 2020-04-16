import {
  request
} from './request';


export function toLogin(username, password) {
  return request({
    url: '/login',
    method: 'GET',
    params: {
      username,
      password
    }
  });
}