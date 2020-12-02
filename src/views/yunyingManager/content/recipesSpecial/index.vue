<template>
	<div class="app-container foodincome-con">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>专题列表</span>
			</div>
			<div class="filter-container">
				<div class="top-box">
					<div class="info-box">
						<div class="info-title">昨日新增</div>
						<div class="info-text">{{recipesInfo.yestodayAddTotal||recipesInfo.yesterdayAddTotal}}</div>
					</div>
					<div class="info-box">
						<div class="info-title">新增失效</div>
						<div class="info-text">{{recipesInfo.overdueAddTotal}}</div>
					</div>
					<div class="info-box">
						<div class="info-title">专题累计</div>
						<div class="info-text">{{recipesInfo.allTotal}}</div>
					</div>
					<div class="info-box">
						<div class="info-title">累计失效</div>
						<div class="info-text">{{recipesInfo.overdueAllTotal}}</div>
					</div>
					<div class="info-box">
						<div class="info-title">累计正常</div>
						<div class="info-text">{{recipesInfo.normalAllTotal}}</div>
					</div>

				</div>
				<el-row style="margin-top: 60px;">
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">专题名称：</div>
						<el-input class="filter-input" size="small" v-model="listQuery.name" placeholder="请输入专题名称" clearable></el-input>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">来源：</div>
						<el-select class="filter-input" size="small" v-model="listQuery.source" placeholder="请选择来源" clearable>
							<el-option v-for="(item,index) in sourceOptions" :key="index" :label="item.name" :value="item.val"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">状态：</div>
						<el-select class="filter-input" size="small" v-model="listQuery.status" placeholder="请选择状态" clearable>
							<el-option v-for="(item,index) in statusOptions" :key="index" :label="item.name" :value="item.val"></el-option>
						</el-select>
					</el-col>

					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<el-button style="margin:0 4px;width:80px" size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
						<el-button style="margin:0 4px;width:80px" size="small" type="success" @click="handleCreateColl(true)">添加专题</el-button>
						<!--<el-button style=" margin:0 6px; " size="small " type="warning " @click="handleFilter ">掌厨导入</el-button>-->
					</el-col>

				</el-row>
			</div>

			<el-table v-loading="listLoading " :data="list " @sort-change="sortChange " border fit highlight-current-row style="width: 100%; ">
				<el-table-column label="序号" align="center " prop="cookId ">
					<template slot-scope="scope ">
						<span>{{scope.row.id}}</span>
					</template>
				</el-table-column>
				<el-table-column label="专题名称 " align="center " prop="name " width="120">
					<template slot-scope="scope ">
						<span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column label="缩略图 " align="center ">
					<template slot-scope="scope ">
						<img v-if="scope.row.image " class="recipeIcon " :src="scope.row.image ">
					</template>
				</el-table-column>

				<el-table-column label="来源 " align="center " prop="source " sortable>
					<template slot-scope="scope ">
						<span>{{scope.row.source | sourceFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="内容类型 " align="center " prop="type " :show-overflow-tooltip=true>
					<template slot-scope="scope ">
						<span>{{scope.row.type | contentType}}</span>
					</template>
				</el-table-column>
				<el-table-column label="内容数量 " align="center " prop="cookCount" :show-overflow-tooltip=true width="120">
					<template slot-scope="scope ">
						<span>{{scope.row.cookCount}}</span>
					</template>
				</el-table-column>
				<el-table-column label="排序 " align="center " prop="sorts " :show-overflow-tooltip=true sortable>
					<template slot-scope="scope ">
						<span>{{scope.row.sorts}}</span>
					</template>
				</el-table-column>

				<el-table-column label="状态 " align="center ">
					<template slot-scope="{row} ">
						<el-tag :type="row.status | tagCssFilter ">{{ row.status | statusFilter }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column width="100px" label="创建时间" align="center" prop="createTime"></el-table-column>
				<el-table-column width="100px" label="更新时间" align="center" prop="updateTime"></el-table-column>
				<el-table-column label="操作 " align="center " width="320 " class-name="small-padding fixed-width ">
					<template slot-scope="{row} ">
						<el-button type="primary " size="mini " @click="toEdit(row)">编辑</el-button>
						<el-button v-if="row.status !==1 " type="success " size="mini " @click="changeStatus(row) ">启用
						</el-button>
						<el-button v-else type="info " size="mini " @click="changeStatus(row) ">停用
						</el-button>
						<el-button v-if="row.status!=='deleted'" size="mini " type="danger " @click="handleDelete(row)">删除
						</el-button>
						<el-button type="primary " size="mini " @click="toCreate(row.id,row.name) ">挑选内容</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
			<add ref="addPage" :isShow="isShow" @closed="closed"></add>
			<edit :isShow="isShowEdit" :editProps="editProps" @closed="closedEdit"></edit>

		</el-card>
	</div>
</template>

<script>
	import {
		fetchAllTag,
		fetchAllFood,
		fetchAllFoodType,
		updateRecipeStatus,
		delRecipe
	} from "@/api/foodManager.js";

	import {
		fetchRecipesList,
		fetchRecipesInfo,
		editRecipes,
		deleteRecipes,
		onOffRecipes
	} from "@/api/recipesConfig.js";
	import Sticky from "@/components/Sticky"; // 粘性header组件
	import Pagination from "@/components/Pagination";
	import add from "./addRecipes.vue"
	import edit from "./editRecipes.vue"
	export default {
		components: {
			Sticky,
			Pagination,
			add,
			edit
		},
		filters: {
			statusFilter(val) {
				if(val === 1) {
					return "上架";
				} else {
					return "下架";
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
				if(val === 1) {
					return "IOT";
				} else if(val === 2) {
					return "掌厨";
				} else {
					return "运营编辑";
				}
			},
			tagsFilter(arr) {
				if(arr) {
					let tagsArr = [];
					for(let index = 0; index < arr.length; index++) {
						const el = arr[index];
						tagsArr.push(el.tag_name);
					}
					return tagsArr.join(",");
				} else {
					return "";
				}
			},
			contentType(val) {
				if(val == 1) {
					return '食谱'
				}
			}
		},
		data: () => ({
			isShow: false,
			isShowEdit: false,
			list: [],
			total: 3,
			listLoading: true,
			editProps: {},
			listQuery: {
				name: null, //名称
				status: null, //状态
				isHasVideo: null, //是否有视频
				source: null, //来源
				season: null, //时令
				festival: null, //节日
				device: null, //设备品类
				effect: null, //功效
				suitablePeople: null, //适应人群
				suitableSick: null, //适宜疾病
				suitablePhysiology: null, //适宜生理阶段
				page: 1,
				page_size: 10
			},
			recipesInfo: {
				yesterdayAddTotal: '--',
				overdueAddTotal: '--',
				allTotal: '--',
				overdueAllTotal: '--',
				normalAllTotal: '--'
			},
			statusOptions: [{
					val: 1,
					name: "上架"
				},
				{
					val: 0,
					name: "下架"
				}
			],
			hasVideoOptions: [{
					val: 1,
					name: "是"
				},
				{
					val: 0,
					name: "否"
				}
			],
			sourceOptions: [{
					val: 1,
					name: "IOT"
				},
				{
					val: 2,
					name: "掌厨"
				},
				{
					val: 3,
					name: "运营编辑"
				}
			],
			dialogStatus: "create",
			collectTextMap: {
				update: "编辑",
				create: "专题信息"
			},
			subRules: {
				name: [{
					required: true,
					message: "请输入专题名称",
					trigger: "change"
				}],
				sorts: [{
					required: true,
					message: "请输入排序号",
					trigger: "blur"
				}],
				introduction: [{
					required: true,
					message: "请输入简介",
					trigger: "blur"
				}],
				description: [{
					required: false,
					message: "请输入描述",
					trigger: "blur"
				}]
			},
			dialogCollectVisible: false,
			colloctTemp: {
				sorts: "",
				source: 3,
				status: 0,
				name: "",
				type: 1,
				introduction: "",
				description: ""
			},
		}),
		created() {
			var self = this;
			//			self.refreshList();
			//			//获取所有食品分类
			//			fetchAllFoodType().then(res => {
			//				this.foodCGOptions = res.data;
			//			});
			self.getList()
		},
		methods: {
			toEdit(row) {
				this.isShowEdit = true;
				this.editProps = JSON.parse(JSON.stringify(row));
			},
			handleDelete(row) {
				//删除专题
				this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteRecipes({
							id: row.id
						}).then(() => {
							this.getList();
							this.$message({
								type: "success",
								message: "删除成功!"
							});
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			changeStatus(row) {
				//停用/启用
				var param = {
					id: row.id,
					token: row.token
				}
				var self=this;
				if(row.status == 1) {
					param.status = 0;
					param = Object.assign({}, row, param);
					delete param.createTime;
					delete param.updateTime;
					delete param.cookCount;
					self.listLoading = true;
					onOffRecipes(param).then((res) => {
						self.listLoading = false;
						row.status = param.status;
					}, (err) => {
						self.listLoading = false;
					})
				} else {
					if(row.cookCount < 1) {
						self.$alert('专题内容数量为空，无法启用！', '温馨提示', {
							confirmButtonText: '确定'
						});
						return;
					} else {
						let title = '确定启用专题《' + row.name + '》吗？';
						self.$confirm(title, "启用专题", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							})
							.then(() => {
								param.status = 1;
								param = Object.assign({}, row, param);
								delete param.createTime;
								delete param.updateTime;
								delete param.cookCount;
								self.listLoading = true;
								onOffRecipes(param).then((res) => {
									self.listLoading = false;
									row.status = param.status;
								}, (err) => {
									self.listLoading = false;
								})
							})
							.catch(() => {
								self.$message({
									type: "info",
									message: "已取消删除"
								});
							});
					}
				}
			},
			closed(data) {
				if(data == 1) {
					//添加成功则刷新页面
					this.getList()
				}
				this.isShow = false;
			},
			closedEdit(data) {
				if(data == 1) {
					//添加成功则刷新页面
					this.getList()
				}
				this.isShowEdit = false;
			},
			refreshList() {
				this.listQuery.page = 1;
				this.getList();
			},
			handleFilter() {
				this.refreshList();
			},
			handleCreateColl(isGood) {
				this.dialogStatus = 'create';
				this.isShow = true;
				//				this.isGood = isGood;
				//				this.resetCollectTemp();
				//				this.dialogStatus = "create";
				//				this.dialogCollectVisible = true;
				//				this.$nextTick(() => {
				//					this.$refs["colloctForm"].clearValidate();
				//				});
			},
			//跳转创建编辑页面
			toCreate(id,name) {
				var param=id+'&'+name;
//				alert(name)
				if(id) {
//					this.$router.push("/resourse/recipes/edit/" + id);
					this.$router.push("/yunying/content/recipes/add/" + param);
				} else {
					this.$router.push("/yunying/content/recipes/add/" + param);
//					this.$router.push("/resourse/recipes/create");
				}
			},
			getList() {
				this.listLoading = true;
				let param=JSON.parse(JSON.stringify(this.listQuery))
				for(const key in param) {
					let val=param[key];
					// 去除对象内多余的空值key
					if(!val&&val!=0) {
						delete param[key];
					}
				}
				fetchRecipesList(param).then(response => {
					this.total = response.data.total;
					this.list = response.data.data;
					let data = this.list;
					this.listLoading = false;
				})
				fetchRecipesInfo().then(response => {
					this.recipesInfo = response.data;
				})
			},
			sortChange(data) {
				
			},

			fetchAllFood(queryString, cb) {
				fetchAllFood({
					name: queryString
				}).then(res => {
					let data = res.data;
					for(let index = 0; index < data.length; index++) {
						let el = data[index];
						el.value = el.name;
					}
					cb(res.data);
				});
			},
			handleSelect(item) {
				// console.log(item)
				this.colloctTemp.id = item.id;
				this.colloctTemp.name = item.name;
			},
			/**
			 * @description: 重置缓存
			 */
			resetCollectTemp() {
				this.colloctTemp = {
					sorts: "",
					name: "",
					introduction: "",
					description: ""
				};
			},
		}
	}
</script>

<style lang="scss" scoped>
	.filter-container {
		.filter-item {
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			.filter-title {
				margin-right: 3px;
				min-width: 80px;
				text-align: right;
			}
			.filter-input {
				width: 160px;
			}
		}
	}
	
	.recipeIcon {
		width: 100px;
	}
	
	.top-box {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		height: auto;
		padding: 0 100px;
		.info-box {
			margin: 10px;
			width: 120px;
			height: 100px;
			border: 1px solid #aaa;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		* {
			text-align: center;
		}
		.info-title {
			height: 32px;
			line-height: 32px;
		}
		.info-text {
			height: 32px;
			line-height: 32px;
			/*font-weight: bolder;*/
			font-size: 30px;
		}
	}
</style>
<style>
	.foodincome-con .el-card__body {
		padding: 20px 40px;
	}
	
	.foodincome-con .p-dialog {
		border-radius: 5px;
	}
	
	.left-space {
		/*height: 100%;*/
	}
</style>