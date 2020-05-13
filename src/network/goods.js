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
//获取分类参数 
export function getCatePamramList(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: "GET",
    params: {
      sel
    }
  });
}

// 根据分类id与分类对象添加分类参数
export function addParam(id, paramData) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'POST',
    data: paramData
  });
}

// 编辑分类参数
export function editParamById(id, attrId, paramData) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "PUT",
    data: paramData
  });

}

//根据参数Id删除参数
export function deleteParamById(id, attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "DELETE",
  });
}