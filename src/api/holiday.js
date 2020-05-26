/*
 * @Description: 节日
 */
import request from '@/utils/request'

let modelHeader = '/admin'

export function fetchList(query) {
  return request({
    url: modelHeader + '/holiday/index',
    method: 'post',
    data: query
  })
}

export function getAll(query) {
  return request({
    url: modelHeader + '/holiday/getAllData',
    method: 'post',
    data: query
  })
}

export function createItem(data) {
  return request({
    url: modelHeader + '/holiday/insert',
    method: 'post',
    data
  })
}

export function getItem(query) {
  return request({
    url: modelHeader + '/holiday/index',
    method: 'post',
    data: query
  })
}
export function updateItem(data) {
  return request({
    url: modelHeader + '/holiday/update',
    method: 'post',
    data
  })
}

export function statusChange(data) {
  return request({
    url: modelHeader + '/holiday/statusChange',
    method: 'post',
    data
  })
}

