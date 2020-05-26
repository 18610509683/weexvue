/*
 * @Description: 天气关怀
 */
import request from '@/utils/request'

let modelHeader = '/admin'

export function fetchList(query) {
  return request({
    url: modelHeader + '/CareManage/index',
    method: 'post',
    data: query
  })
}

export function createItem(data) {
  return request({
    url: modelHeader + '/CareManage/add',
    method: 'post',
    data
  })
}

export function statusChange(data) {
  return request({
    url: modelHeader + '/CareManage/statusChange',
    method: 'post',
    data
  })
}

export function getItem(query) {
  return request({
    url: modelHeader + '/CareManage/detail',
    method: 'post',
    data: query
  })
}
export function updateItem(data) {
  return request({
    url: modelHeader + '/CareManage/edit',
    method: 'post',
    data
  })
}

export function delItem(data) {
  return request({
    url: modelHeader + '/CareManage/delete',
    method: 'post',
    data
  })
}

export function getCookDetail(query) {
  return request({
    url: modelHeader + '/CareManage/getCookDetail',
    method: 'post',
    data: query
  })
}

export function getUserFeature(query) {
  return request({
    url: modelHeader + '/CareManage/getUserFeature',
    method: 'post',
    data: query
  })
}

export function getWeatherConditionType(query) {
  return request({
    url: modelHeader + '/CareManage/weatherConditionType',
    method: 'post',
    data: query
  })
}

export function getAllWeatherCondition(query) {
  return request({
    url: modelHeader + '/CareManage/weatherCondition',
    method: 'post',
    data: query
  })
}

