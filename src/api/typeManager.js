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