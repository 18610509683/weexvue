/*
 * @Description: 卡片位置管理的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
//根据主题名称检索专题
export function getSubjectList(data) {
  return request({
    url: modelHeader+'/CardPosition/index',
    method: 'post',
    data
  })
}
//根据输入内容检索专题列表
export function getSubjectListByName(data) {
  return request({
    url: modelHeader+'/CardPosition/getRecipeSubjectByName',
    method: 'post',
    data
  })
}
//添加卡片页
export function createCardPos(data) {
  return request({
    url: modelHeader+'/CardPosition/save',
    method: 'post',
    data
  })
}
//编辑卡片页
export function editCardPos(data) {
  return request({
    url: modelHeader+'/CardPosition/update',
    method: 'post',
    data
  })
}
//停用卡片
export function stopCardPos(data) {
  return request({
    url: modelHeader+'/CardPosition/upStatus',
    method: 'post',
    data
  })
}
//删除卡片
export function deleteCardPos(data) {
  return request({
    url: modelHeader+'/CardPosition/delete',
    method: 'post',
    data
  })
}