import {
  request
} from './request';


export function getMenuData() {
  return request({
    method: "GET",
    url: "/menus"
  });
}