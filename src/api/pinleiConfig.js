/*
 * @Description: 品类信息管理的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
export function fetchList(query) {
  return request({
    url: modelHeader+'/CentralCtrConf/index',
    method: 'post',
    data: query
  })
}



export function createItem(data) {
  return request({
    url: modelHeader+'/CentralCtrConf/save',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: modelHeader+'/CentralCtrConf/update',
    method: 'post',
    data
  })
}
export function delItem(data) {
  return request({
    url: modelHeader+'/CentralCtrConf/delete',
    method: 'post',
    data
  })
}

