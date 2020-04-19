import {
  request
} from './request';


// 获取权限列表
export function getRightsList() {
  return request({
    url: "/rights/list",
    method: "GET"
  });
}


// 获取角色列表
export function getRoleList() {
  return request({
    url: "/roles",
    method: "GET"
  });
}

// 根据角色id与被删除权限id删除权限
export function deleteRightById(roleId, RightId) {
  return request({
    url: `/roles/${roleId}/rights/${RightId}`,
    method: "DELETE"
  });
}

// 获取权限树形列表
export function getRightsTreeList() {
  return request({
    url: "/rights/tree",
    method: "GET"
  });
}

//  角色授权
export function updateRightsByRoleIdAndRights(roleId, rights) {
  return request({
    url: `/roles/${roleId}/rights`,
    method: "post",
    data: {
      rids: rights
    }
  });
}

export function deleteByRoleId(roleId) {
  console.log(roleId);
  return request({
    url: `/roles/${roleId}`,
    method: "DELETE"
  });
}


export function addRole(roleData) {
  return request({
    url: '/roles',
    method: "POST",
    data: roleData
  });
}
export function getRoleById(id) {
  return request({
    url: `/roles/${id}`,
    method: 'GET'
  });
}
export function editRoleById({
  roleId,
  roleName,
  roleDesc
}) {
  return request({
    url: `/roles/${roleId}`,
    method: "PUT",
    data: {
      roleName,
      roleDesc
    }
  });
}