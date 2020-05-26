/*
 * @Description: 运营模块的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
//获取用户反馈列表
export function fetchSuggestionList(data) {
  return request({
    url: modelHeader+'/Suggestion/index',
    method: 'post',
    data
  })
}
//更新反馈信息
export function updateSuggestion(data) {
  return request({
    url: modelHeader+'/Suggestion/update',
    method: 'post',
    data
  })
}
//获取冰箱型号列表
export function fetchFridgeTypeList(data) {
  return request({
    url: modelHeader+'/Suggestion/getAllFridgeTypeList',
    method: 'post',
    data
  })
}

 