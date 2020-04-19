import {
  request
} from './request';


// 获取用户列表
export function getUserList(queryInfo) {
  return request({
    method: "GET",
    url: "/users",
    params: queryInfo
  });
}

// 更新用户状态
export function updateState(uid, state) {
  return request({
    method: "PUT",
    url: `/users/${uid}/state/${state}`,
  });
}

//新增用户
export function addUser(userInfo) {

  return request({
    method: "POST",
    url: '/users',
    data: userInfo
  });
}

// 根据id删除用户
export function deleteUserById(uid) {

  return request({
    method: "DELETE",
    url: `/users/${uid}`,
  });
}

// 根据用户id获取用户详情信息
export function getDetailById(uid) {

  return request({
    method: "GET",
    url: `/users/${uid}`,
  });
}

// 根据用户ID编辑用户信息
export function editUserById(uid, email, mobile) {
  return request({
    method: "PUT",
    url: `/users/${uid}`,
    data: {
      email,
      mobile
    }
  });
}

// 给用户分配新角色

export function distriNewRole(userId, rid) {
  return request({
    url: `/users/${userId}/role`,
    method: 'PUT',
    data: {
      rid
    }
  });
}