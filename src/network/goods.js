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

export function deleteCateById(id) {
  return request({
    url: `/categories/${id}`,
    method: "DELETE",
  });
}

export function editCategory({
  cat_id,
  cat_name
}) {
  return request({
    url: `/categories/${cat_id}`,
    method: "PUT",
    data: {
      cat_name
    }
  });
}