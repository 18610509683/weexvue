/*
 * @Description: 食材食谱分类的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
//获取导航树状结构数据
export function getAllFoodCategoryTree(data) {
	return request({
		url: modelHeader + '/FoodManage/getAllFoodCategoryTree',
		method: 'post',
		data
	})
}
//获取分页食材类型列表
export function fetchFoodType(data) {
	return request({
		url: modelHeader + '/FoodManage/getFoodCategoryList',
		method: 'post',
		data
	})
}
//新增食材类型 
export function addFoodType(data) {
	return request({
		url: modelHeader + '/FoodManage/addFoodCategory',
		method: 'post',
		data
	})
}
//食谱分类列表查询
export function getCookCategoryList(data){
	return request({
		url: modelHeader + '/CookManage/getCookCategoryList',
		method: 'post',
		data
	})	
}
//获取食谱分类级联菜单导航数据
export function getAllCookCategoryTree(data){
	return request({
		url: modelHeader + '/CookManage/getAllCookCategoryTree',
		method: 'post',
		data		
	})
}
//编辑食谱分类
export function updateCategory(data){
	return request({
		url: modelHeader + '/CookManage/updateCategory',
		method: 'post',
		data		
	})	
}
//添加食谱分类
export function addCookCategory(data){
	return request({
		url: modelHeader + '/CookManage/addCookCategory',
		method: 'post',
		data		
	})	
}
//更新上下架状态
export function upCategoryStatus(data){
	return request({
		url: modelHeader + '/CookManage/upCategoryStatus',
		method: 'post',
		data		
	})	
}
//删除食谱分类
export function deleteCategory(data){
	return request({
		url: modelHeader + '/CookManage/deleteCategory',
		method: 'post',
		data		
	})	
}