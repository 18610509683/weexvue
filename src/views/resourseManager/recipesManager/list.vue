<!--
 * @Description: 垃圾信息管理页面
 -->

<template>
	<div class="app-container foodincome-con">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>食谱列表</span>
			</div>
			<div class="filter-container">
				<el-row>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">食谱名称</div>
						<el-input v-model="listQuery.name" class="filter-input" size="small" placeholder="食谱名称" />
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">状态</div>
						<el-select v-model="listQuery.status" class="filter-input" size="small" placeholder="状态" clearable>
							<el-option v-for="(item,index) in statusOptions" :key="index" :label="item.name" :value="item.val" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">视频</div>
						<el-select v-model="listQuery.isHasVideo" class="filter-input" size="small" placeholder="视频" clearable>
							<el-option v-for="(item,index) in hasVideoOptions" :key="index" :label="item.name" :value="item.val" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">来源</div>
						<el-select v-model="listQuery.source" class="filter-input" size="small" placeholder="来源" clearable>
							<el-option v-for="(item,index) in sourceOptions" :key="index" :label="item.name" :value="item.val" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">时令</div>
						<el-select v-model="listQuery.season" class="filter-input" size="small" placeholder="时令" clearable>
							<el-option v-for="item in seasonOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">节日</div>
						<el-select v-model="listQuery.festival" class="filter-input" size="small" placeholder="节日" clearable>
							<el-option v-for="item in festivalOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">设备</div>
						<el-select v-model="listQuery.device" class="filter-input" size="small" placeholder="设备" clearable>
							<el-option v-for="item in deviceOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">功效</div>
						<el-select v-model="listQuery.effect" class="filter-input" size="small" placeholder="功效" clearable>
							<el-option v-for="item in effectOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">适宜人群</div>
						<el-select v-model="listQuery.suitablePeople" class="filter-input" size="small" placeholder="适宜人群" clearable>
							<el-option v-for="item in peopleOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">适宜疾病</div>
						<el-select v-model="listQuery.suitableSick" class="filter-input" size="small" placeholder="适宜疾病" clearable>
							<el-option v-for="item in sickOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
						<div class="filter-title">适宜阶段</div>
						<el-select v-model="listQuery.suitablePhysiology" class="filter-input" size="small" placeholder="适宜阶段" clearable>
							<el-option v-for="item in physiologyOptions" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="24" :sm="12" :lg="16">
						<div class="filter-title">分类</div>
						<el-cascader style="min-width: 360px;" v-model="cascaderValue" :show-all-levels="true" :options="cascaderOptions" :change-on-select="true" @change="changeCascader" filterable clearable expand-trigger="hover">
						</el-cascader>
					</el-col>

					<!--<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">一级分类</div>
            <el-select
              v-model="listQuery.categoryOneId"
              class="filter-input"
              size="small"
              filterable
              placeholder="一级分类"
              clearable
            >
              <el-option
                v-for="item in categoryOneIdArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">二级分类</div>
            <el-select
              v-model="listQuery.categoryTwoId"
              class="filter-input"
              size="small"
              filterable
              placeholder="二级分类"
              clearable
            >
              <el-option
                v-for="item in categoryTwoIdArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">三级分类</div>
            <el-select
              v-model="listQuery.categoryThreeId"
              class="filter-input"
              size="small"
              filterable
              placeholder="三级分类"
              clearable
            >
              <el-option
                v-for="item in categoryThreeIdArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>-->
					<el-col class="filter-item" :xs="24" :sm="12" :lg="6">
						<el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
						<!-- <el-button size="small" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toCreate()" >新建食材</el-button> -->
						<!--            <el-button size="small" style="margin-left: 10px;" type="success" icon="el-icon-refresh"-->
						<!--                       @click="syncIOTRecipes()">同步IOT食谱-->
						<!--            </el-button>-->
					</el-col>
					<el-col :span="8" />
				</el-row>
			</div>

			<el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
				<el-table-column label="ID" align="center" prop="cookId" />
				<el-table-column label="食谱名称" align="center" prop="name" />
				<el-table-column label="封面图" align="center">
					<template slot-scope="scope">
						<img v-if="scope.row.image" class="recipeIcon" :src="scope.row.image">
					</template>
				</el-table-column>
				<el-table-column label="视频" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.isHasVideo === 1 ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="来源" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.source | sourceFilter }}</span>
					</template>;
				</el-table-column>
				<el-table-column label="设备品类" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.device }}</span>
					</template>
				</el-table-column>
				<el-table-column label="时令" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.season }}</span>
					</template>
				</el-table-column>
				<el-table-column label="节日" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.festival }}</span>
					</template>
				</el-table-column>
				<el-table-column label="功效" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.effect }}</span>
					</template>
				</el-table-column>
				<el-table-column label="适宜人群" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.suitablePeople }}</span>
					</template>
				</el-table-column>
				<el-table-column label="适宜阶段" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.suitablePhysiology }}</span>
					</template>
				</el-table-column>
				<el-table-column label="适宜疾病" align="center" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.suitableSick }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="{row}">
						<el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column width="100px" label="创建时间" align="center" prop="createTime" />
				<el-table-column width="100px" label="更新时间" align="center" prop="updateTime" />
				<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
					<template slot-scope="{row}">
						<el-button type="primary" size="mini" @click="toCreate(row.cookId)">编辑</el-button>
						<el-button v-if="row.status !== 1" type="success" size="mini" @click="changeStatus(row)">上架
						</el-button>
						<el-button v-else type="info" size="mini" @click="changeStatus(row)">下架
						</el-button>
						<el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
		</el-card>
	</div>
</template>

<style lang="scss" scoped>
	.filter-container {
		.filter-item {
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			.filter-title {
				margin-right: 3px;
				min-width: 80px;
			}
			.filter-input {
				width: 160px;
			}
		}
	}
	
	.recipeIcon {
		width: 100px;
	}
</style>
<style>
	.foodincome-con .el-card__body {
		padding: 20px 40px;
	}
	
	.foodincome-con .p-dialog {
		border-radius: 5px;
	}
</style>

<script>
	import {
		fetchRecipesList,
		fetchAllTag,
		fetchAllCategory,
		// fetchAllFoodType,
		updateRecipeStatus,
		delRecipe
	} from '@/api/foodManager.js'
	// import { parseTime } from "@/utils";
	import Pagination from '@/components/Pagination' // secondary package based on el-pagination

	import {
		getAllFoodCategoryTree,
		addFoodType,
		getCookCategoryList,
		getAllCookCategoryTree,
		updateCategory,
		addCookCategory,
		upCategoryStatus,
		deleteCategory
	} from '@/api/typeManager';
	var navData = undefined;
	
	export default {
		// name: "foodIncome",
		components: {
			Pagination
		},
		filters: {
			statusFilter(val) {
				if(val === 1) {
					return '上架'
				} else {
					return '下架'
				}
			},
			tagCssFilter(type) {
				const css = {
					'1': 'success',
					'2': 'info'
				}
				return css[type]
			},
			sourceFilter(val) {
				if(val === 1) {
					return 'IOT'
				} else if(val === 2) {
					return '掌厨'
				} else {
					return '运营编辑'
				}
			},
			tagsFilter(arr) {
				if(arr) {
					const tagsArr = []
					for(let index = 0; index < arr.length; index++) {
						const el = arr[index]
						tagsArr.push(el.tag_name)
					}
					return tagsArr.join(',')
				} else {
					return ''
				}
			}
		},
		data() {
			return {
				list: [],
				total: 3,
				listLoading: true,
				listQuery: {
					name: null, // 名称
					status: null, // 状态
					isHasVideo: null, // 是否有视频
					source: null, // 来源
					season: null, // 时令
					festival: null, // 节日
					device: null, // 设备品类
					effect: null, // 功效
					suitablePeople: null, // 适应人群
					suitableSick: null, // 适宜疾病
					suitablePhysiology: null, // 适宜生理阶段
					categoryOneId: null,
					categoryTwoId: null,
					categoryThreeId: null,
					categoryId:null,
					page: 1,
					page_size: 10
				},
				cascaderValue: null,
				cascaderOptions: null,
				timeRange: '',
				statusOptions: [{
						val: 1,
						name: '上架'
					},
					{
						val: 2,
						name: '下架'
					}
				],
				hasVideoOptions: [{
						val: 1,
						name: '是'
					},
					{
						val: 0,
						name: '否'
					}
				],
				sourceOptions: [{
						val: 1,
						name: 'IOT'
					},
					{
						val: 2,
						name: '掌厨'
					},
					{
						val: 3,
						name: '运营编辑'
					}
				],

				seasonOptions: [],
				festivalOptions: [],
				peopleOptions: [],
				deviceOptions: [],
				effectOptions: [],
				sickOptions: [],
				physiologyOptions: [],
				categoryOneIdArr: [],
				categoryTwoIdArr: [],
				categoryThreeIdArr: [],
				downloadLoading: false
			}
		},
		computed: {},
		watch: {},
		created() {
			this.getNavData();
			fetchAllTag().then(res => {
				// 获取时令季节数据
				this.seasonOptions = res.data[1]
				// 获取节日数据
				this.festivalOptions = res.data[2]
				// 获取适应人群数据
				this.peopleOptions = res.data[3]
				// 获取设备品类数据
				this.deviceOptions = res.data[10]
				// 获取功效数据
				this.effectOptions = res.data[5]
				// 获取适宜疾病数据
				this.sickOptions = res.data[6]
				// 获取生理阶段数据
				this.physiologyOptions = res.data[4]
			})

			fetchAllCategory().then(res => {
				this.categoryOneIdArr = res.data[1]
				this.categoryTwoIdArr = res.data[2]
				this.categoryThreeIdArr = res.data[3]
			})
			this.refreshList()
		},
		methods: {
			//级联菜单选择事件
			changeCascader(valArr) {
				var val = valArr.slice();
				this.listQuery.categoryId = val.pop();
			},
			//获取级联菜单数据
			getNavData() {
				var self = this;
				let a = this.cascaderOptions;
				return new Promise(function(resolve, reject) {
					getAllCookCategoryTree().then(res => {
						self.cascaderOptions = res.data;
						navData = res.data;
						self.refreshMenu();
						resolve(res)
					}, err => {
						reject(err)
					})
				});
			},
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
			/**
			 * @description: 获取垃圾信息列表的数据
			 */
			refreshList() {
				this.listQuery.page = 1
				this.getList()
			},
			getList() {
				this.listLoading = true

				for(const key in this.listQuery) {
					// 去除对象内多余的空值key
					if(this.listQuery[key] === null) {
						delete this.listQuery[key]
					}
				}
				console.log(this.listQuery)
				fetchRecipesList(this.listQuery).then(response => {
					console.log(response)
					this.total = response.data.total
					this.list = response.data.data
					this.listLoading = false
				})
			},

			handleFilter() {
				this.refreshList()
			},
			sortChange(data) {
				console.log(data)
			},
			/**
			 * @description: 删除垃圾信息
			 * @param row
			 */
			handleDelete(row) {
				this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delRecipe({
							id: row.cookId
						}).then(() => {
							for(const v of this.list) {
								if(v.cookId === row.cookId) {
									const index = this.list.indexOf(v)
									this.list.splice(index, 1)
									break
								}
							}
							this.$message({
								type: 'success',
								message: '删除成功!'
							})
						})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						})
					})
			},
			// 上下架
			changeStatus(row) {
				const newRow = Object.assign({}, row)
				if(newRow.status == 1) {
					newRow.status = 2
				} else {
					newRow.status = 1
				}
				newRow.alias = newRow.name_alias
				updateRecipeStatus(newRow).then(() => {
					this.getList()
					this.$message({
						type: 'success',
						message: '操作成功'
					})
				})
			},
			// 跳转创建编辑页面
			toCreate(id) {
				if(id) {
					this.$router.push('/resourse/recipes/edit/' + id)
				} else {
					this.$router.push('/resourse/recipes/create')
				}
			},
			// 同步iot食谱
			syncIOTRecipes() {}
		}
	}
</script>