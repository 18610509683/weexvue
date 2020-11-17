<template>
	<div class="app-container foodincome-con">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>添加专题食谱</span>
			</div>
			<div class="filter-container">
				<el-row>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="4">
						<div class="filter-title">食谱名称：</div>
						<el-input class="filter-input" size="small" v-model="listQuery.name" placeholder="食谱名称" clearable></el-input>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="4">
						<div class="filter-title">状态：</div>
						<el-select class="filter-input" size="small" v-model="listQuery.status" placeholder="状态" clearable>
							<el-option v-for="(item,index) in statusOptions" :key="index" :label="item.name" :value="item.val"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="4">
						<div class="filter-title">视频：</div>
						<el-select class="filter-input" size="small" v-model="listQuery.isHasVideo" placeholder="视频" clearable>
							<el-option v-for="(item,index) in hasVideoOptions" :key="index" :label="item.name" :value="item.val"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="12" :sm="8" :lg="4">
						<div class="filter-title">来源：</div>
						<el-select class="filter-input" size="small" v-model="listQuery.source" placeholder="来源" clearable>
							<el-option v-for="(item,index) in sourceOptions0" :key="index" :label="item.name" :value="item.val"></el-option>
						</el-select>

					</el-col>

					<el-col class="filter-item" :xs="12" :sm="8" :lg="4">
						<el-button style="margin-left: 30px;" size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
						<!-- <el-button size="small" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toCreate()" >新建食材</el-button> -->
						<!--            <el-button size="small" style="margin-left: 10px;" type="success" icon="el-icon-refresh"-->
						<!--                       @click="syncIOTRecipes()">同步IOT食谱-->
						<!--            </el-button>-->
					</el-col>
				</el-row>
				<el-row class="button-row">
					<el-button style="margin:0 4px;width:80px" size="small" type="primary" @click="handleCreateColl(true)">添加</el-button>
					<el-button style=" margin:0 6px; " size="small " type="success " @click="showBatchAdd ">批量添加</el-button>
				</el-row>
			</div>

			<el-table v-loading="listLoading " :data="list " @sort-change="sortChange " border fit highlight-current-row style="width: 100%; ">
				<el-table-column label="食谱id" align="center " prop="cookId ">
					<template slot-scope="scope ">
						<span>{{scope.row.cookId}}</span>
					</template>
				</el-table-column>
				<el-table-column label="食谱名称" align="center" prop="name"></el-table-column>
				<el-table-column label="封面图" align="center">
					<template slot-scope="scope">
						<img v-if="scope.row.image" class="recipeIcon" :src="scope.row.image">
					</template>
				</el-table-column>
				<el-table-column label="视频" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.isHasVideo === 1 ? '是' : '否'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="来源" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.source | sourceFilter}}</span>
					</template>;
				</el-table-column>
				<el-table-column label="设备品类" align="center" :show-overflow-tooltip=true>
					<template slot-scope="scope">
						<span>{{scope.row.device}}</span>
					</template>
				</el-table-column>
				<el-table-column label="时令" align="center" :show-overflow-tooltip=true>
					<template slot-scope="scope">
						<span>{{scope.row.season}}</span>
					</template>
				</el-table-column>
				<el-table-column label="节日" align="center" :show-overflow-tooltip=true>
					<template slot-scope="scope">
						<span>{{scope.row.festival}}</span>
					</template>
				</el-table-column>
				<el-table-column label="功效" align="center" :show-overflow-tooltip=true>
					<template slot-scope="scope">
						<span>{{scope.row.effect}}</span>
					</template>
				</el-table-column>
				<el-table-column label="适宜人群" align="center" :show-overflow-tooltip=true>
					<template slot-scope="scope">
						<span>{{scope.row.suitablePeople}}</span>
					</template>
				</el-table-column>
				<el-table-column label="适宜阶段" align="center" :show-overflow-tooltip=true>
					<template slot-scope="scope">
						<span>{{scope.row.suitablePhysiology}}</span>
					</template>
				</el-table-column>
				<el-table-column label="适宜疾病" align="center" :show-overflow-tooltip='true'>
					<template slot-scope="scope">
						<span>{{scope.row.suitableSick}}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="{row}">
						<el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
					</template>
				</el-table-column>
				<!--<el-table-column width="100px" label="创建时间" align="center" prop="createTime"></el-table-column>
				<el-table-column width="100px" label="更新时间" align="center" prop="updateTime"></el-table-column>-->
				<el-table-column label="操作 " align="center " width="180 " class-name="small-padding fixed-width ">
					<template slot-scope="{row} ">
						<el-button type="primary " size="mini " @click="toCreate(row.cookId) ">查看</el-button>
						<!--<el-button v-if="row.status !==1 " type="success " size="mini " @click="changeStatus(row) ">上架
						</el-button>
						<el-button v-else type="info " size="mini " @click="changeStatus(row) ">下架
						</el-button>-->
						<el-button v-if="row.status!=='deleted' " size="mini " type="danger " @click="handleDelete(row) ">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--<!--<sticky :z-index="10 " class-name="sub-navbar draft ">
				<el-button v-loading="loading " style="margin-left: 10px; " type="success " @click="goback ">取消</el-button>
				<el-button v-loading="loading " type="warning " @click="submitForm ">保存</el-button>
			</sticky>-->
			<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

			<el-dialog custom-class="p-dialog" :title="collectTextMap[dialogStatus]" :visible.sync="dialogCollectVisible">
				<el-form ref="colloctForm" :rules="subRules" :model="colloctTemp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
					<el-form-item label="专题名称" prop="name">
						<el-autocomplete v-model="colloctTemp.name" :fetch-suggestions="fetchAllFood" placeholder="请输入食材名称或别名进行搜索" @select="handleSelect" style="width: 300px;" disabled></el-autocomplete>
					</el-form-item>
					<el-form-item label="选择食谱" prop="cookId">
						<el-select v-model="colloctTemp.cookId" filterable remote placeholder="请输入文字" v-loadmore="loadmore" :remote-method="searchText" style="width:300px" :loading="loading">
							<el-option v-for="(item,index) in validList" :key="index" :label="item.name" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item label="排序" prop="sorts">
						<el-input v-model="colloctTemp.sorts" type="number" min="1" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogCollectVisible = false">取消</el-button>
					<el-button type="primary" @click="addRecipe">确定</el-button>
				</div>
			</el-dialog>
			<el-dialog custom-class="batchAdd-dialog" title="批量添加食谱" :visible.sync="batchAddVisible">
				<div class="filter-container">
					<el-row>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">食谱名称</div>
							<el-input class="filter-input" size="small" v-model="listQueryAll.name" placeholder="食谱名称"></el-input>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">来源</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.source" placeholder="来源" clearable>
								<el-option v-for="(item,index) in sourceOptions" :key="index" :label="item.name" :value="item.val"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">视频</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.isHasVideo" placeholder="视频" clearable>
								<el-option v-for="(item,index) in hasVideoOptions" :key="index" :label="item.name" :value="item.val"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">设备</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.device" placeholder="设备" clearable>
								<el-option v-for="item in deviceOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">时令</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.season" placeholder="时令" clearable>
								<el-option v-for="item in seasonOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">节日</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.festival" placeholder="节日" clearable>
								<el-option v-for="item in festivalOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">功效</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.effect" placeholder="功效" clearable>
								<el-option v-for="item in effectOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">适宜人群</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.suitablePeople" placeholder="适宜人群" clearable>
								<el-option v-for="item in peopleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">适宜疾病</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.suitableSick" placeholder="适宜疾病" clearable>
								<el-option v-for="item in sickOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<el-col class="filter-item" :xs="12" :sm="8" :lg="6">
							<div class="filter-title">适宜阶段</div>
							<el-select class="filter-input" size="small" v-model="listQueryAll.suitablePhysiology" placeholder="适宜阶段" clearable>
								<el-option v-for="item in physiologyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-col>
						<div style="float: right;">
							<el-button style="margin:0 4px;width:80px" size="small" type="primary" @click="searchRecipes">查询</el-button>
							<el-button style=" margin:0 6px;width:80px" size="small " type="success " @click="trueToAddRecipes ">添加</el-button>
						</div>

					</el-row>
					<el-col class="filter-item">
						<div class="filter-title">已选中</div>
						<el-select class="selected-input" multiple filterable v-model="selectedID" placeholder="已选食谱" clearable value-key="name" @change="valueChanged">
							<el-option v-for="(item,index) in selectedOptions" :key="index" :label="item.name" :value="item.cookId"></el-option>
						</el-select>
					</el-col>
				</div>

				<el-table v-loading="listLoadingAll" :data="listAll" @sort-change="sortChange" border fit highlight-current-row ref="multipleTable" tooltip-effect="dark" @select-all="handleSelectionChange" @row-click="clickData">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column label="食谱ID" align="center" prop="cookId"></el-table-column>
					<el-table-column label="食谱名称" align="center" prop="name"></el-table-column>
					<el-table-column label="封面图" align="center">
						<template slot-scope="scope">
							<img v-if="scope.row.image" class="recipeIcon" :src="scope.row.image">
						</template>
					</el-table-column>
					<el-table-column label="视频" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.isHasVideo === 1 ? '是' : '否'}}</span>
						</template>
					</el-table-column>
					<el-table-column label="来源" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.source | sourceFilter}}</span>
						</template>;
					</el-table-column>
					<el-table-column label="设备品类" align="center" :show-overflow-tooltip=true>
						<template slot-scope="scope">
							<span>{{scope.row.device}}</span>
						</template>
					</el-table-column>

					<el-table-column label="状态" align="center">
						<template slot-scope="{row}">
							<el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
						</template>
					</el-table-column>

				</el-table>

				<pagination v-show="totalAll>0" :total="totalAll" :page.sync="listQueryAll.page" :limit.sync="listQueryAll.page_size" @pagination="getListAll" />
			</el-dialog>
			<router-view />
		</el-card>
	</div>
</template>

<script>
	import {
		fetchRecipesList,
		fetchAllTag,
		fetchAllFood,
		fetchAllFoodType,
		updateRecipeStatus,
		delRecipe
	} from "@/api/foodManager.js";

	import {
		searchList,
		getValidRecipe,
		addSpecialRecipe,
		addCookDetailBatch
	} from "@/api/recipesConfig.js";
	import { getToken } from "@/utils/auth";
	import Sticky from "@/components/Sticky"; // 粘性header组件
	import Pagination from "@/components/Pagination";
	var index = 1;
	var savedText = undefined;
	//控制已无多余数据的查询
	var allowSearch = true;
	//保存专题id
	var subjectId = undefined;
	export default {
		components: {
			Sticky,
			Pagination
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
			}
		},
		data: () => ({
			selectedID: [], //多选的食谱id
			selectedOptions: [],
			list: [],
			listAll: [],
			validList: [],
			listLoading: true,
			listLoadingAll: false,
			loading: false,
			total: 0,
			listQuery: {
				cookId: null, //食谱id
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
				suitablePhysiology: null, //适宜阶段
				page: 1,
				page_size: 10
			},
			totalAll: 0,
			listQueryAll: {
				cookId: null, //食谱id
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
				suitablePhysiology: null, //适宜阶段
				page: 1,
				page_size: 10
			},
			statusOptions: [{
					val: 1,
					name: "上架"
				},
				{
					val: 2,
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
			sourceOptions0: [{
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
			sourceOptions: [],
			seasonOptions: [],
			festivalOptions: [],
			peopleOptions: [],
			functionOptions: [],
			deviceOptions: [],
			effectOptions: [],
			sickOptions: [],
			physiologyOptions: [],
			dialogStatus: "",
			collectTextMap: {
				update: "编辑",
				create: "添加食谱"
			},
			subRules: {
				name: [{
					required: true,
					message: "请选择食材",
					trigger: "change"
				}],
				id: [{
					required: true,
					message: "食材ID",
					trigger: "blur"
				}],
				function: [{
					required: false,
					message: "请输入功效",
					trigger: "blur"
				}]
			},
			dialogCollectVisible: false,
			batchAddVisible: false,
			colloctTemp: {
				subjectId: null,
				name: "",
				sorts: 1
			},
		}),
		computed: {
			uploadParam() {
				let param = {
					token: getToken()
				};
				return param;
			},

		},
		created() {

			console.log(this.listQuery)
			var self = this;
			self.refreshList();

			fetchAllTag().then(res => {
				console.log(res)
				//获取时令季节数据
				this.seasonOptions = res.data[1];
				//获取节日数据
				this.festivalOptions = res.data[2];
				//获取适应人群数据
				this.peopleOptions = res.data[3];
				//获取生理阶段数据
				this.physiologyOptions = res.data[4];
				//获取功效数据
				this.effectOptions = res.data[5];
				//获取适宜疾病数据
				this.sickOptions = res.data[6];
				//获取口味数据
				this.tasteOptions = res.data[7];
				//获取菜系数据
				this.dishStyleOptions = res.data[8];
				//获取菜式数据
				this.cookStyleOptions = res.data[9];
				//获取设备品类数据
				this.deviceOptions = res.data[10];
			});
		},
		methods: {
			//select值变化时
			//兼更新当页列表食谱选中状态
			valueChanged(val) {
				let arr = this.listAll;
				let selectedID = this.selectedID;
				for(let k in arr) {
					let index = selectedID.indexOf(arr[k].cookId);
					let temp = index == -1 ? false : true;
					this.$refs.multipleTable.toggleRowSelection(arr[k], temp)
				}
			},
			//点击table行添加或删除
			clickData(row, column, event) {
				let selectedID = this.selectedID;
				let index = selectedID.indexOf(row.cookId);
				if(index != -1) {
					selectedID.splice(index, 1);
				} else {
					selectedID.push(row.cookId);
				}
				this.$refs.multipleTable.toggleRowSelection(row)
			},
			//全选事件
			handleSelectionChange(val) {
				this.multipleSelection = val;
				let selectedID = this.selectedID;
				if(val.length > 0) {
					//全选
					val.forEach((v, k) => {
						if(selectedID.indexOf(v.cookId) == -1) {
							selectedID.push(v.cookId)
						}
					})
				} else {
					//全不选
					let arr = this.listAll;
					for(let i in arr) {
						let index = selectedID.indexOf(arr[i].cookId);
						if(index != -1) {
							selectedID.splice(index, 1);
						}
					}
				}
			},
			//批量添加时查询食谱
			searchRecipes() {
				this.listLoadingAll = true;
				let data = this.listQueryAll;
				data = JSON.parse(JSON.stringify(data));
				for(const key in data) {
					// 去除对象内多余的空值key
					if(data[key] === null) {
						delete data[key];
					}
				}
				fetchRecipesList(data).then(response => {
					let res = response.data.data;
					let options = this.selectedOptions;
					res.forEach((v, k) => {
						if(options.indexOf(v.cookId) == -1) {
							let obj = {
								cookId: v.cookId,
								name: v.name
							}
							options.push(obj)
						}
					})
					this.totalAll = response.data.total;
					this.listAll = response.data.data;
					this.listLoadingAll = false;
					this.$nextTick(() => {
						this.valueChanged()
					})
				});
			},
			//批量添加时分页点击事件
			getListAll() {
				this.searchRecipes()
			},
			//批量添加时最后确认添加
			trueToAddRecipes() {
				let cookIds = this.selectedID.join(',');
				let param = {
					subjectId: subjectId,
					cookIds: cookIds
				}
				addCookDetailBatch(param).then((resp) => {
					console.log(resp)
				}, err => {
					console.log(err)
				})
			},
			//单项添加时确定点击
			addRecipe() {
				var temp = this.colloctTemp;
				let param = JSON.parse(JSON.stringify(temp));
				delete param.name;
				addSpecialRecipe(param).then((res) => {
					this.dialogCollectVisible = false;
					this.getList()
				})
			},
			//单项添加时输入名称检索
			searchText(text) {
				//执行按输入文字检索
				var self = this;
				allowSearch = true;
				text = text.trim();
				if(text != savedText) {
					self.validList = [];
					index = 1;
				}
				var Tex = savedText = text;
				if(!text) {
					self.validList = [];
					allowSearch = false;
					index = 1;
					return;
				}
				self.loading = true;
				fetchRecipesList({
					page: index,
					page_size: 100,
					name: Tex
				}).then(res => {
					self.loading = false;
					if(!allowSearch) return;
					let data = res.data.data;
					var left = res.data.total - 100 * index;
					if(left <= 0) {
						//无多余数据
						allowSearch = false;
					}
					let temp = this.validList;
					for(let i in data) {
						temp.push({
							value: data[i].id,
							name: data[i].name + '：ID ' + data[i].id
						})
					}
					this.listLoading = false;
					index++;
				});
			},
			//滚动时加载更多
			loadmore() {
				var self = this;
				var Tex;
				if(allowSearch) {
					allowSearch = false;
					self.searchText(savedText);
				}
			},
			//初始化页面
			refreshList() {
				this.listQuery.page = 1;
				this.getList();
			},
			handleFilter() {
				this.listLoading = true;
				let arr = this.$route.params.id.split("&");
				this.colloctTemp.subjectId = arr[0];
				subjectId = arr[0];
				this.colloctTemp.name = arr[1];
				let page = this.listQuery.page;

				let data = this.listQuery;
				data = JSON.parse(JSON.stringify(data));
				for(const key in data) {
					// 去除对象内多余的空值key
					if(data[key] === null||!data[key]) {
						delete data[key];
					}
				}
				data.subjectId = arr[0];
				data.page = page;
				searchList(data).then(response => {
					this.list = response.data.data;
					this.total = response.data.total;
					this.listLoading = false;
				})
			},
			//添加食谱显示
			handleCreateColl(isGood) {
				this.isGood = isGood;
				this.dialogStatus = "create";
				this.dialogCollectVisible = true;
				this.$nextTick(() => {
					this.$refs["colloctForm"].clearValidate();
				});
			},
			//批量添加显示
			showBatchAdd() {
				this.batchAddVisible = true;
			},
			//跳转创建编辑页面
			toCreate(id) {
				if(id) {
					this.$router.push("/resourse/recipes/edit/" + id);
				} else {
					this.$router.push("/resourse/recipes/create");
				}
			},
			getList() {
				this.listLoading = true;
				let arr = this.$route.params.id.split("&");
				this.colloctTemp.subjectId = arr[0];
				subjectId = arr[0];
				this.colloctTemp.name = arr[1];
				console.log(this.colloctTemp);
				let page = this.listQuery.page;
				let data = this.listQuery;
				data = JSON.parse(JSON.stringify(data));
				for(const key in data) {
					// 去除对象内多余的空值key
					if(data[key] === null) {
						delete data[key];
					}
				}
				data.subjectId = arr[0];
				data.page = page;
				searchList(data).then(response => {
					this.list = response.data.data;
					this.total = response.data.total;
					this.listLoading = false;
				})
			},
			sortChange(data) {},

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
				this.colloctTemp.subjectId = item.id;
				this.colloctTemp.name = item.name;
			},
			/**
			 * @description: 重置缓存
			 */
			resetCollectTemp() {
				this.colloctTemp = {
					id: null,
					name: "",
					function: ""
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
			.selected-input {
				width: 600px!important;
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
	
	.button-row {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
	
	.left-space {
		/*height: 100%;*/
	}
	
	.batchAdd-dialog {
		min-width: 900px;
	}
</style>