import {
  request
} from './request';

export function getOrderList(queryInfo) {
  return request({
    url: "orders",
    method: "GET",
    params: queryInfo
  })
}

// 根据id获取物流信息
export function getLogisticsById(id) {
  return request({
    url: `/kuaidi/${id}`,
    method: "GET",
  })
}