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

/*分页专题列表*/
export function fetchRecipesList(data){
	return request({
		url:modelHeader+'/RecipeSubject/index',
		method:'post',
		data
	})
}

/*获取专题统计信息*/
export function fetchRecipesInfo(data){
	return request({
		url:modelHeader+'/RecipeSubject/statistics',
		method:'post',
		data
	})
}

/*添加专题*/
export function addRecipes(data){
	return request({
		url:modelHeader+'/RecipeSubject/save',
		method:'post',
		data
	})	
}

/*编辑专题*/ 
export function editRecipes(data){
	return request({
		url:modelHeader+'/RecipeSubject/update',
		method:'post',
		data
	})	
}
/*删除专题*/
export function deleteRecipes(data){
	return request({
		url:modelHeader+'/RecipeSubject/delete',
		method:'post',
		data
	})	
}
/*启用停用专题*/
export function onOffRecipes(data){
	return request({
		url:modelHeader+'/RecipeSubject/upStatus',
		method:'post',
		data
	})	
}
/*图片上传*/
export function uploadImg(data){
	return request({
		url:modelHeader+'/RecipeSubject/uploadFile',
		method:'post',
		data
	})	
}
/*查询专题食谱列表*/
export function searchList(data){
	return request({
		url:modelHeader+'/RecipeSubject/cookList',
		method:'post',
		data
	})	
}
/*分页获取所有食谱列表*/
export function getValidRecipe(data) {
  return request({
    url: modelHeader+'/CookManage/index',
    method: 'post',
    data
  })
}
/*专题添加食谱*/
export function addSpecialRecipe(data){
  return request({
    url: modelHeader+'/RecipeSubject/addCookDetail',
    method: 'post',
    data
  })	
}
/*专题食谱添加批量*/
export function addCookDetailBatch(data){
  return request({
    url: modelHeader+'/RecipeSubject/addCookDetailBatch',
    method: 'post',
    data
  })	
}
