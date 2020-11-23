<!--
 * @Description: 垃圾信息管理页面
 -->

<template>
	<div class="app-container garbage-con">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>食材分类</span>
			</div>
			<div class="filter-container">
				<el-row>
					<el-col class="filter-item" :xs="24" :sm="12" :lg="8">
						<div class="filter-title">分类名称</div>
						<el-input class="filter-input" size="small" v-model="listQuery.name" placeholder="请输入分类名称" clearable></el-input>
					</el-col>
					<!--          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">-->
					<!--            <div class="filter-title">一级分类</div>-->
					<!--            <el-select class="filter-input" size="small" v-model="FoodTypeQuery.first" clearable placeholder="请选择一级分类">-->
					<!--              <el-option v-for="item in firstOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
					<!--            </el-select>-->
					<!--          </el-col>-->
					<!--          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">-->
					<!--            <div class="filter-title">二级分类</div>-->
					<!--            <el-select class="filter-input" size="small" v-model="listQuery.second" clearable placeholder="请选择二级分类">-->
					<!--              <el-option v-for="item in secondOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
					<!--            </el-select>-->
					<!--          </el-col>-->
					<!--          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">-->
					<!--            <div class="filter-title">三级分类</div>-->
					<!--            <el-select class="filter-input" size="small" v-model="listQuery.third" clearable placeholder="请选择三级分类">-->
					<!--              <el-option v-for="item in thirdOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
					<!--            </el-select>-->
					<!--          </el-col>-->
					<el-col class="filter-item" :xs="24" :sm="12" :lg="16">
						<div class="filter-title">分类</div>
						<el-cascader style="min-width: 360px;" v-model="cascaderValue" :show-all-levels="true" :options="cascaderOptions" :change-on-select="true" @change="changeCascader" filterable clearable expand-trigger="hover">
						</el-cascader>
					</el-col>
					<el-col class="filter-item" :xs="24" :sm="12" :lg="8">
						<div class="filter-title">分类显示</div>
						<el-select class="filter-input" size="small" v-model="listQuery.isShow" clearable placeholder="请选择是否分类显示">
							<el-option v-for="item in isShowOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="24" :sm="12" :lg="8">
						<div class="filter-title">状态</div>
						<el-select class="filter-input" size="small" v-model="listQuery.status" clearable placeholder="请选择状态">
							<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="24" :sm="12" :lg="8">
						<el-button class="filter-item fix-width" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
						<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增分类</el-button>
					</el-col>
				</el-row>
			</div>

			<el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" :default-expand-all="false" row-key="id" lazy :load="tableLazyLoad" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @row-click="openDetails">
				<el-table-column label="ID" prop="id" align="center" width="100"></el-table-column>

				<el-table-column label="标签名称" align="center">
					<template slot-scope="{row}">
						<div>
							<img v-if="row.image && row.image.length>0" class="garbage-img" :src="row.image" @click="handleGarbageImgPreview(row)" />
							<div>{{row.name}}</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="标签别名" align="center" prop="aliasName"></el-table-column>
				<el-table-column label="来源" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.source | sourceFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="分类显示" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.isShow | isShowFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="{row}">
						<el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="备注" align="center" prop="remark"></el-table-column>
				<el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
				<el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>

				<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
						<el-button v-if="row.status == 2" type="success" size="mini" @click="changeStatus(row)">上架</el-button>
						<el-button v-else type="info" size="mini" @click="changeStatus(row)">下架</el-button>
						<el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-dialog custom-class="p-dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="temp.name" />
				</el-form-item>
				<el-form-item label="分类别名" prop="aliasName">
					<el-input v-model="temp.aliasName" />
				</el-form-item>
				<el-form-item label="父级分类" prop="aliasName">
					<!--<el-select v-model="temp.parentId" class="filter-item" placeholder="请选择" filterable clearable>
						<el-option v-for="(item,i) in handleTypeFilter(parentTypeOptions)" :key="i" :label="item.name" :value="item.id" />
					</el-select>-->
					<el-cascader style="min-width: 310px;" v-model="defaultShow" :show-all-levels="true" :options="addEditParentOptions" :change-on-select="true" @change="changeCascader2" filterable clearable expand-trigger="hover" placeholder="请选择父类,不选则为1级分类">
					</el-cascader>
				</el-form-item>
				<!--<el-form-item label="子级分类" prop="aliasName">
					<el-select v-model="temp.children" class="filter-item" placeholder="请选择" filterable multiple clearable disabled>
						<el-option v-for="(item,i) in handleTypeFilter(childrenTypeOptions)" :key="i" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>-->
				<el-form-item v-if="temp.parentId == null || temp.parentId == ''" label="排序" prop="sort" placeholder="请输入数字">
					<el-input type="number" min="0" v-model="temp.sort" />
				</el-form-item>
				<el-form-item label="来源" prop="source">
					<el-select disabled v-model="temp.source" class="filter-item" placeholder="请选择">
						<el-option v-for="(item,i) in sourcesOptions" :key="i" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="分类显示" prop="aliasName">
					<el-radio v-model="isShow" label="1">是</el-radio>
					<el-radio v-model="isShow" label="2">否</el-radio>
				</el-form-item>

				<el-form-item label="封面图" prop="image" ref="uploadFormItem">
					<el-upload class="upload-demo" name="img_url" :action="'https://fridge-api.mideav.com/admin' + '/rubbish/uploadImg'" :file-list="uploadImgList" :on-preview="handleUploadImgPreview" :on-remove="uploadImgRemove" :on-success="uploadImgSuccess" :on-exceed="uploadExceed" :data="uploadParam" :limit="1" list-type="picture-card">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="temp.remark" type="textarea" :rows="3" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
			</div>
		</el-dialog>

		<el-dialog custom-class="p-dialog" :visible.sync="dialogImgPreviewVisible" width="30%" size="tiny">
			<img width="100%" :src="dialogImageUrl" alt />
		</el-dialog>
	</div>
</template>

<script>
	import { fetchFoodType, getRelationFoodCategory, insertFoodType, delFoodType, updateFoodType, updateFoodTypeStatus } from "@/api/foodManager";
	// import { parseTime } from "@/utils";
	import { getToken } from "@/utils/auth";
	//	import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
	import {
		getAllFoodCategoryTree,
		addFoodType,
	} from '@/api/typeManager';

	var navData = undefined;
	var parents = {};
	export default {
		name: "TagManager",
		// components: { Pagination },
		inject:['reload'],
		filters: {
			statusFilter(val) {
				if(val == 1) {
					return "上架";
				} else {
					return "下架";
				}
			},
			isShowFilter(val) {
				if(val == 1) {
					return "是";
				} else {
					return "否";
				}
			},
			tagCssFilter(type) {
				let css = {
					"1": "success",
					"2": "info"
				};
				return css[type];
			},
			sourceFilter(val) {
				switch(val) {
					case 1:
						return "IOT";
						break;
					case 2:
						return "掌厨";
						break;
					case 3:
						return "运营编辑";
						break;
					default:
						return "";
						break;
				}
			}
		},
		props: {
			type: {
				type: String,
				default: ""
			}
		},
		computed: {
			uploadParam() {
				let param = {
					token: getToken()
				};
				return param;
			},
		},
		data() {
			return {
				list: [],
				total: 0,
				listLoading: true,
				isShowOptions: [{
					value: 1,
					label: "是"
				}, {
					value: 0,
					label: "否"
				}],
				statusOptions: [{
					value: 1,
					label: "上架"
				}, {
					value: 2,
					label: "下架"
				}],
				sourcesOptions: [{
						label: "IOT",
						value: 1
					},
					{
						label: "掌厨",
						value: 2
					},
					{
						label: "运营编辑",
						value: 3
					}
				],
				firstOptions: null,
				secondOptions: null,
				thirdOptions: null,
				cascaderValue: null,
				parentTypeOptions: null,
				childrenTypeOptions: null,
				addEditParentOptions: null,
				defaultShow: [],
				currentEdit: null,
				listQuery: {
					name: null,
					// first: null,
					// second: null,
					// third: null,
					isShow: null,
					status: null, //状态
					page: 1,
					page_size: 20,
					parentId: null,
				},
				cascaderOptions: null,

				isShow: "1",
				temp: {
					name: null,
					aliasName: null,
					parentId: null,
					children: null,
					sort: null,
					isShow: null,
					source: null, //1iot 2掌厨 3运营编辑
					image: null,
					remark: null //备注
				},

				dialogStatus: "",
				textMap: {
					update: "编辑",
					create: "新增"
				},
				rules: {
					source: [{
						required: true,
						message: "请选择来源",
						trigger: "change"
					}],
					name: [{
						required: true,
						message: "请输入名字",
						trigger: "blur"
					}],
					sort: [{
						required: true,
						message: "请输入排序值",
						trigger: "blur"
					}],
				},
				dialogFormVisible: false,
				downloadLoading: false,
				uploadImgList: [],
				dialogImageUrl: "",
				dialogImgPreviewVisible: false,
				FoodTypeQuery: [],
				curRow: null,
				curRowChild: null,
				//    props: {
				//      checkStrictly: true,
				//      lazy: true,
				//      lazyLoad (node, resolve) {
				//      	console.log(303)
				//          let  tmp= new Array()
				//          tmp['parentId']=  node.value
				//          fetchFoodType(tmp).then(res => {
				//          	console.log(res)
				//            let tmpArr = []
				//            for (let j = 0; j < res.data.length; j++) {
				//              let tmp = {
				//                value:  res.data[j]["id"],
				//                label: res.data[j]["name"],
				//                leaf: res.data[j]["leaf"],
				//              };
				//              tmpArr.push(tmp);
				//            }
				//            resolve(tmpArr)
				//          })
				//      }
				//    }
			};
		},

		watch: {
			// 如果 `dialogFormVisible` 发生改变，这个函数就会运行
			dialogFormVisible: function(newV, oldV) {
				if(newV == false) {
					this.uploadImgList = [];
				}
			},
			'listQuery.first': function(newV, oldV) {
				for(let index = 0; index < this.firstOptions.length; index++) {
					const el = this.firstOptions[index];
					if(el.id == newV) {
						this.secondOptions = el.children
					}
				}
				if(newV == "" && oldV != null) {
					this.secondOptions = null
					this.thirdOptions = null
					this.listQuery.second = ''
					this.listQuery.third = ''
				}
			},
			'listQuery.second': function(newV, oldV) {
				for(let index = 0; index < this.secondOptions.length; index++) {
					const el = this.secondOptions[index];
					if(el.id == newV) {
						this.thirdOptions = el.children
					}
				}
				if(newV == "" && oldV != null) {
					this.thirdOptions = null
					this.listQuery.third = ''
				}
			},
			//当前编辑项的id
			currentEdit: {
				handler(nv, ov) {

				},
				immediate: false
			}
		},
		created() {
			this.getNavData();
			this.refreshList();
		},
		methods: {
			//更新添加、编辑级联菜单
			refreshMenu() {
				if(!navData) return;
				var self = this;
				var obj = JSON.parse(JSON.stringify(navData));
				for(let j in obj) {
					for(let k in obj[j]) {
						for(let m in obj[j][k]) {
							delete obj[j][k][m].children
						}
					}
				}
				self.addEditParentOptions = obj
			},
			//获取级联菜单数据
			getNavData() {
				this.listLoading = true;
				var self = this;
				let a = this.cascaderOptions;
				return new Promise(function(resolve, reject) {
					getAllFoodCategoryTree().then(res => {
						console.log(res.data)
						self.cascaderOptions = res.data;
						self.listLoading = false;
						navData = res.data;
						self.refreshMenu();
						resolve(res)
					}, err => {
						reject(err)
					})
				});
			},
			//级联菜单选择事件
			changeCascader(valArr) {
				var val = valArr.slice();
				this.listQuery.parentId = val;
			},
			//添加、编辑菜单选择事件
			changeCascader2(valArr) {
				var val = valArr.slice();
				console.log(val)
			},
			//table懒加载
			tableLazyLoad(tree, treeNode,resolve) {
				let tmp = new Array()
				tmp['parentId'] = tree.id
				fetchFoodType(tmp).then(res => {
					var data = res.data;
					for(let i in data) {
						let temp = parents[data[i].parentId];
						if(temp) {
							let arr = temp.slice()
							arr.push(data[i].parentId)
							parents[data[i].id] = arr;
						}
					}
					resolve(res.data)
				});
			},
			openDetails(row) {
				console.log(row)
			},
			//刷新页面数据
			refreshList() {
				this.listQuery.page = 1
				this.getList()
			},
			//获取后台分类数据
			getList: function() {
				this.listLoading = true;

				let param = JSON.parse(JSON.stringify(this.listQuery))

				for(const key in param) {
					// 去除对象内多余的空值key
					if(!param[key] && param[key] != 0) {
						delete param[key]
					}
				}
				var valAr = undefined;
				if(param.parentId) {
					valAr = param.parentId.slice();
					param.parentId = valAr[valAr.length-1];
				}
				fetchFoodType(param).then(res => {
					this.list = res.data
					this.listLoading = false;
					for(let i in res.data) {
						if(valAr) {
							parents[res.data[i].id]	= valAr;
						} else {
							parents[res.data[i].id] = [];
						}
					}
				})
			},
			//重置缓存
			resetTemp() {
				let temp = this.dialogStatus == 'create' ? 3 : null;
				console.log(temp)
				this.temp = {
					id: null,
					name: null,
					aliasName: null,
					parentId: null,
					children: null,
					sort: null,
					isShow: null,
					defaultShow:[],
					source: temp, //1iot 2掌厨 3运营编辑
					image: null,
					remark: null //备注
				};
				this.isShow = "1"
			},
			//查询按钮事件
			handleFilter() {
				this.refreshList();
			},
			//新增按钮事件
			handleCreate() {
				this.dialogStatus = "create";
				this.resetTemp();
				this.defaultShow=[];
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs["dataForm"].clearValidate();
				});
			},
			//确定创建事件
			createData() {
				this.$refs["dataForm"].validate(valid => {
					if(valid) {
						this.temp.isShow = this.isShow
						if(this.temp.parentId != null && this.temp.parentId != '') {
							this.temp.sort = null
						}
						
						let parentid= this.defaultShow;
						let ind=parentid.length;
						this.temp.parentId=ind>0?parentid[ind-1]:0;
						
						var tempData = Object.assign({}, this.temp);
						delete tempData.defaultShow;
						for(let key in tempData){
							if(!tempData[key]&&tempData[key]!=0){
								delete tempData[key]
							}
						}
						console.log(tempData)
						addFoodType(tempData).then(() => {
							this.dialogFormVisible = false
							parents={}
//							this.refreshList();
							this.reload();
							this.$notify({
								title: '成功',
								message: '已成功创建',
								type: 'success',
								duration: 2000
							});
						});
					}
				});
			},
			//编辑按钮事件
			handleUpdate(row) {
				if(!navData) {
					this.$notify({
						title: '温馨提示',
						message: '您点太快了，请等待菜单数据加载完成',
						type: 'success',
						duration: 2000,
					});
					return;
				}
				this.defaultShow = parents[row.id]
				this.temp = Object.assign({}, row); // copy obj
				this.isShow = this.temp.isShow.toString()
				if(this.temp.parentId == 0) {
					this.temp.parentId = null
				}

				//				//获取上级分类 和下级分类
				//				getRelationFoodCategory(row).then(res => {
				//					console.log(res.data)
				//					this.parentTypeOptions = res.data.parentList
				//					this.childrenTypeOptions = res.data.childList
				//					this.temp.children = res.data.childSelect //选中的
				//					this.temp.parentId = row.parentId //选中的
				//
				//					this.curRowChild = Object.assign({}, res.data.childSelect)
				//				})

				//					this.curRow = Object.assign({}, row)
				// if (row.children.length>0) {
				//   let children = []
				//   for (let index = 0; index < row.children.length; index++) {
				//     const element = row.children[index];
				//     children.push(element.id)
				//   }
				//   this.curRow.children = children
				//   this.temp.children = children
				// }
				//
				if(row.image && row.image.length > 0) {
					this.uploadImgList = [{
						url: row.image
					}];
				} else {
					this.uploadImgList = [];
				}
				this.dialogStatus = 'update';
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs["dataForm"].clearValidate();
				});
			},
			//确定编辑事件
			updateData() {
				this.$refs["dataForm"].validate(valid => {
					if(valid) {
						this.temp.isShow = this.isShow
						if(this.temp.children == this.curRowChild) {
							this.temp.children = ''
						}
						if(this.temp.parentId != null && this.temp.parentId != '') {
							this.temp.sort = null
						}
						let parentid= this.defaultShow;
						let ind=parentid.length;
						this.temp.parentId=ind>0?parentid[ind-1]:0;
						
						var tempData = Object.assign({}, this.temp);
						delete tempData.defaultShow;
						updateFoodType(tempData).then(() => {
							this.dialogFormVisible = false
							parents={}
//							this.getList()
							this.reload()
							this.$notify({
								title: '成功',
								message: '更新成功',
								type: 'success',
								duration: 2000
							});
						});
					}
				});
			},
			//删除按钮事件
			handleDelete(row) {
				this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						delFoodType({
							id: row.id
						}).then(() => {
//							this.getList()
							this.reload()
							this.$message({
								type: "success",
								message: "删除成功!"
							});
						});
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
			},
			//上下架
			changeStatus(row) {
				let newRow = Object.assign({}, row);
				if(newRow.status == 1) {
					newRow.status = 2
				} else {
					newRow.status = 1
				}
				updateFoodTypeStatus({
					id: newRow.id,
					status: newRow.status
				}).then(() => {
					this.getList()
					this.$message({
						type: 'success',
						message: '操作成功'
					});
				});
			},
			//上传成功
			uploadImgSuccess(response, file, fileList) {
				console.log(response);
				if(fileList.length > 0) {
					this.temp.image = response.data.all_img_url;
					//移除必填的提醒
					// this.$refs["uploadFormItem"].clearValidate();
				} else {
					this.temp.image = "";
				}
			},
			//删除图片
			uploadImgRemove() {
				this.temp.image = "";
			},
			//表格图片预览
			handleGarbageImgPreview(row) {
				this.dialogImageUrl = row.image;
				this.dialogImgPreviewVisible = true;
			},
			//上传图片预览
			handleUploadImgPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogImgPreviewVisible = true;
			},
			uploadExceed(files, fileList) {
				this.$message.error("图片只能上传一张，请先删除再上传！");
			},
			//级联菜单过滤
			handleTypeFilter(arr) {
				//obj=>{temp.id == undefined||(temp.id != undefined&&obj.id!=temp.id)
				if(arr) {
					let types = []
					for(let index = 0; index < arr.length; index++) {
						let el = arr[index];
						if(this.temp.id == undefined) {
							types.push(el)
						} else {
							if(el.id != this.temp.id) {
								types.push(el)
							}
						}
					}
					return types
				} else {
					return []
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.garbage-img {
		object-fit: cover;
		width: 45px;
		height: 45px;
	}
	
	.filter-container {
		.filter-item {
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			.filter-title {
				margin-right: 8px;
				min-width: 80px;
			}
			.filter-input {
				width: 250px;
			}
		}
	}
</style>
<style>
	.garbage-con .el-card__body {
		padding: 20px 40px;
	}
	
	.garbage-con .p-dialog {
		border-radius: 5px;
	}
	
	.fix-width {
		width: 112px;
	}
	
	.fix-width i {
		margin-left: 10px;
	}
	.garbage-con .p-dialog{
		min-width: 544px!important;
	}
</style>