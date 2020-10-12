/*
 * @Description: 标签管理的网络请求
 */
import request from '@/utils/request'

let modelHeader = '/admin'
//食材列表
export function fetchFoodList(data) {
  return request({
    url: modelHeader+'/FoodManage/index',
    method: 'post',
    data
  })
}
//获取标签列表
export function fetchAllTag(data) {
  return request({
    url: modelHeader+'/CookManage/getTagList',
    method: 'post',
    data
  })
}

//食材新建或编辑
export function createFood(data,isEdit) {
  let url = ''
  if (isEdit) {
    url = '/FoodManage/update'
  } else {
    url = '/FoodManage/insertFood'
  }
  return request({
    url: modelHeader+url,
    method: 'post',
    data
  })
}
//食材状态更新
export function updateFoodStatus(data) {
  return request({
    url: modelHeader+'/FoodManage/updateStatus',
    method: 'post',
    data
  })
}
//食材更新
// export function updateFood(data) {
//   return request({
//     url: modelHeader+'/FoodManage/editFood',
//     method: 'post',
//     data
//   })
// }
//食材删除
export function delFood(data) {
  return request({
    url: modelHeader+'/FoodManage/delete',
    method: 'post',
    data
  })
}
//获取所有食材
export function fetchAllFood(data) {
  return request({
    url: modelHeader+'/FoodManage/getAllFood',
    method: 'post',
    data
  })
}
//获取食材详情
export function fetchFoodDetail(data) {
  return request({
    url: modelHeader+'/FoodManage/detail',
    method: 'post',
    data
  })
}


//获取所有食材分类
export function fetchAllFoodType(data) {
  return request({
    url: modelHeader+'/FoodManage/getFoodCategory',
    method: 'post',
    data
  })
}
//获取分页食材类型列表
export function fetchFoodType(data) {
  return request({
    url: modelHeader+'/FoodType/typeList',
    method: 'post',
    data
  })
}
//新增食材类型
export function insertFoodType(data) {
  return request({
    url: modelHeader+'/FoodType/insert',
    method: 'post',
    data
  })
}
//食材分类删除
export function delFoodType(data) {
  return request({
    url: modelHeader+'/FoodType/delete',
    method: 'post',
    data
  })
}
//食材分类编辑
export function updateFoodType(data) {
  return request({
    url: modelHeader+'/FoodType/update',
    method: 'post',
    data
  })
}
//获取级联食材分类
export function fetchCascadeFoodType(data) {
  return request({
    url: modelHeader+'/FoodType/allType',
    method: 'post',
    data
  })
}
//食材分类上下架
export function updateFoodTypeStatus(data) {
  return request({
    url: modelHeader+'/FoodType/updateStatus',
    method: 'post',
    data
  })
}


//获取所有食谱分类
export function fetchAllRecipeType(data) {
  return request({
    url: modelHeader+'/CookBookCategory/getFoodType',
    method: 'post',
    data
  })
}

//获取食谱分类详情
export function fetchRecipeTypeDetail(data) {
  return request({
    url: modelHeader+'/CookBookCategory/detail',
    method: 'post',
    data
  })
}
//获取分页食谱类型列表
export function fetchRecipeType(data) {
  return request({
    url: modelHeader+'/CookBookCategory/typeList',
    method: 'post',
    data
  })
}
//新增食谱类型
export function insertRecipeType(data) {
  return request({
    url: modelHeader+'/CookBookCategory/insert',
    method: 'post',
    data
  })
}
//食谱分类删除
export function delRecipeType(data) {
  return request({
    url: modelHeader+'/CookBookCategory/delete',
    method: 'post',
    data
  })
}
//食谱分类编辑
export function updateRecipeType(data) {
  return request({
    url: modelHeader+'/CookBookCategory/update',
    method: 'post',
    data
  })
}
//获取级联食谱分类
export function fetchCascadeRecipeType(data) {
  return request({
    url: modelHeader+'/CookBookCategory/allType',
    method: 'post',
    data
  })
}
//食谱分类上下架
export function updateRecipeTypeStatus(data) {
  return request({
    url: modelHeader+'/CookBookCategory/updateStatus',
    method: 'post',
    data
  })
}



//食材列表
export function fetchRecipesList(data) {
  return request({
    url: modelHeader+'/CookManage/index',
    method: 'post',
    data
  })
}

// //食谱新建或编辑
export function createRecipe(data,isEdit) {
  let url = ''
  if (isEdit) {
    url = '/CookManage/update'
  } else {
    url = '/CookManage/save'
  }
  return request({
    url: modelHeader+url,
    method: 'post',
    data
  })
}
//食谱状态更新
export function updateRecipeStatus(data) {
  return request({
    url: modelHeader+'/CookManage/updateStatus',
    method: 'post',
    data
  })
}
//食谱删除
export function delRecipe(data) {
  return request({
    url: modelHeader+'/CookManage/delete',
    method: 'post',
    data
  })
}
// //获取所有食材
// export function fetchAllFood(data) {
//   return request({
//     url: modelHeader+'/FoodManage/getAllFood',
//     method: 'post',
//     data
//   })
// }
//获取食谱详情
export function fetchRecipeDetail(data) {
  return request({
    url: modelHeader+'/CookManage/detail',
    method: 'post',
    data
  })
}
//获取所有食材分类
export function fetchAllRecipesType(data) {
  return request({
    url: modelHeader+'/CookManage/getCookCategory',
    method: 'post',
    data
  })
}

