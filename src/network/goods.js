import {
  request
} from './request';


export function getCategories(queryInfo) {
  return request({
    url: "/categories",
    params: queryInfo
  });
}

export function addCategory(cateData) {
  return request({
    url: "/categories",
    method: "POST",
    data: cateData
  });
}