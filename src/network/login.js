import {request} from './request';


export function toLogin(username, password) {
  return request({
    url: '/login',
    type:'GET',
    params: {
      username,
      password
    }
  });
}