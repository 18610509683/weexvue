/*
 * @Description: 菜谱参数配置的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
export function fetchConfigList(data) {
  return request({
    url: modelHeader+'/RecipesConfigure/index',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: modelHeader+'/RecipesConfigure/update',
    method: 'post',
    data
  })
}

