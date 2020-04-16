import {
  request
} from './request';


export function getUserList(queryInfo) {
  return request({
    method: "GET",
    url: "/users",
    params: queryInfo
  });
}

export function updateState(uid, state) {
  return request({
    method: "PUT",
    url: `/users/${uid}/state/${state}`,
  });
}

export function addUser(userInfo) {

  return request({
    method: "POST",
    url: '/users',
    data: userInfo
  });
}

export function deleteUserById(uid) {

  return request({
    method: "DELETE",
    url: `/users/${uid}`,
  });
}

export function getDetailById(uid) {

  return request({
    method: "GET",
    url: `/users/${uid}`,
  });
}

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