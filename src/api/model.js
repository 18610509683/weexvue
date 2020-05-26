/*
 * @Description: 模块配置
 */
import request from '@/utils/request'

let modelHeader = '/admin'

export function fetchList(query) {
  return request({
    url: modelHeader + '/PointModularConf/index',
    method: 'post',
    data: query
  })
}

export function createItem(data) {
  return request({
    url: modelHeader + '/PointModularConf/save',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: modelHeader + '/PointModularConf/update',
    method: 'post',
    data
  })
}
export function delItem(data) {
  return request({
    url: modelHeader + '/PointModularConf/delete',
    method: 'post',
    data
  })
}

