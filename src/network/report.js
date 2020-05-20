import {
  request
} from './request';

export function getReportData() {
  return request({
    url: "/reports/type/1",
    method: "GET"
  })
}