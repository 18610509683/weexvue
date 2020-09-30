/*
 * @Description: 标签管理的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
//标签列表
export function fetchTagList(data) {
  return request({
    url: modelHeader+'/EatTagManager/tagList',
    method: 'post',
    data
  })
}
//增加标签
export function addTag(data) {
  return request({
    url: modelHeader+'/EatTagManager/save',
    method: 'post',
    data
  })
}
//编辑标签
export function updateTag(data) {
  return request({
    url: modelHeader+'/EatTagManager/update',
    method: 'post',
    data
  })
}
//删除标签
export function delTag(data) {
  return request({
    url: modelHeader+'/FoodTags/delete',
    method: 'post',
    data
  })
}

