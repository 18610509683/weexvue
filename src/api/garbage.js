/*
 * @Description: 垃圾信息管理的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
export function fetchList(query) {
  return request({
    url: modelHeader+'/Rubbish/index',
    method: 'post',
    data: query
  })
}



export function createGarbage(data) {
  return request({
    url: modelHeader+'/Rubbish/save',
    method: 'post',
    data
  })
}

export function updateGarbage(data) {
  return request({
    url: modelHeader+'/Rubbish/update',
    method: 'post',
    data
  })
}
export function delGarbage(data) {
  return request({
    url: modelHeader+'/Rubbish/delete',
    method: 'post',
    data
  })
}


export function fetchCategoryList(query) {
  return request({
    url: modelHeader+'/Rubbish/getCategoryList',
    method: 'post',
    data: query
  })
}
