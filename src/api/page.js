/*
 * @Description: 页面配置
 */
import request from '@/utils/request'

let modelHeader = '/admin'

export function fetchList(query) {
  return request({
    url: modelHeader + '/PointPageConf/index',
    method: 'post',
    data: query
  })
}

export function createItem(data) {
  return request({
    url: modelHeader + '/PointPageConf/save',
    method: 'post',
    data
  })
}

export function updateItem(data) {
  return request({
    url: modelHeader + '/PointPageConf/update',
    method: 'post',
    data
  })
}
export function delItem(data) {
  return request({
    url: modelHeader + '/PointPageConf/delete',
    method: 'post',
    data
  })
}

