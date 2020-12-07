<template>
	<div class="app-container foodincome-con">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>冰箱插件-饮食页</span>
			</div>
			<div class="filter-container">
				<el-row>
					<el-col class="filter-item" :xs="24" :sm="24" :lg="8" style="margin-right: 100px;">
						<div class="filter-title">卡片名称：</div>
						<el-input class="filter-input" size="medium" v-model="listQuery.name" placeholder="请输入关键字" style="min-width:300px;" clearable></el-input>
					</el-col>
					<el-col class="filter-item" :xs="8" :sm="8" :lg="4">
						<div class="filter-title">卡片类型：</div>
						<el-select class="filter-input" size="medium" v-model="listQuery.listType" placeholder="全部" clearable>
							<el-option v-for="(item,index) in cardOptions" :key="index" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="8" :sm="8" :lg="4">
						<div class="filter-title">状态：</div>
						<el-select class="filter-input" size="medium" v-model="listQuery.statusType" placeholder="全部" clearable>
							<el-option v-for="(item,index) in statusOptions" :key="index" :label="item.name" :value="item.value"></el-option>
						</el-select>
					</el-col>
					<el-col class="filter-item" :xs="6" :sm="6" :lg="2" style="margin: 0 10px;">
						<el-button size="medium" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="filter-item" :xs="12" :sm="12" :lg="12">
						<span class="demonstration">有效时间：</span>
						<el-date-picker v-model="value2" type="datetimerange" :picker-options="pickerOptions" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" align="left" value-format="yyyy-MM-dd HH:mm" @change="pickedTime2">
						</el-date-picker>
					</el-col>
				</el-row>
			</div>
			<div class="btn-nav">
				<div v-for="(itm,index) in navOption" @click="navClicked(index)" :class="['common',navIndex==index?'navActive':'']">{{itm}}</div>
				<el-button class="creat-card" type="success" @click="toCreate">创建卡片</el-button>
			</div>
			<div class="list-box">
				<div class="list-itm" v-for="(itm,index) in listData">
					<div class="rect-icon">{{(listQuery.page-1)*listQuery.page_size+index+1}}</div>
					<div class="itm-body">
						<span class="itm-title">{{itm.name}}</span>
						<span class="itm-info">卡片类型：{{getText(itm.listType)}}</span>
						<span class="itm-info">有效期：{{itm.startTime}} 至 {{itm.endTime}}</span>
						<span class="itm-info">创建时间：{{itm.createTime}}</span>
						<span class="itm-info">更新时间：{{itm.updateTime}}</span>
					</div>
					<div class="right-status">
						<el-button :type="getBtnType(itm.statusType)" style="border-radius: 0;" size="normal">{{getSatus(itm.statusType)}}</el-button>
						<div class="btn-operate" @click="toEdit(itm)">编辑</div>
						<div class="btn-operate" @click="toStop(itm,itm.id,itm.status)">{{itm.status==1?'停用':'启用'}}</div>
						<div v-if="itm.name!='热门食谱'" class="btn-operate" @click="toDel(itm.id)">删除</div>
					</div>
				</div>
				<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="handleFilter" />
				<!--<div style="background: #000;">下一个</div>-->
			</div>
			<el-dialog custom-class="batchAdd-dialog" title="新建卡片" :visible.sync="cardAddVisible">
				<div class="filter-container">
					<el-form ref="colloctForm" :rules="subRules" :model="listQueryAdd" label-position="left" label-width="100px">
						<div class="card-box">
							<el-form-item label="卡片名称" prop="name">
								<el-input v-model="listQueryAdd.name" placeholder="请输入卡片名称" class="card-input" clearable/>
							</el-form-item>
							<el-form-item label="所属展位" prop="position">
								<el-select class="selected-input" v-model="listQueryAdd.position" placeholder="请选择展示位置" clearable value-key="name">
									<el-option v-for="(item,index) in positionOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="卡片类型" prop="listType">
								<el-select class="selected-input" v-model="listQueryAdd.listType" placeholder="请选择卡片类型" clearable value-key="name">
									<el-option v-for="(item,index) in listTypeOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="专题类型" prop="subjectType">
								<el-select class="selected-input" v-model="listQueryAdd.subjectType" placeholder="请选择专题类型" clearable value-key="name">
									<el-option v-for="(item,index) in subjectTypeOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="内容名称" prop="subjectId">
								<el-select v-model="listQueryAdd.subjectId" filterable remote placeholder="请输入内容名称" v-loadmore="loadmore" :remote-method="searchText" :loading="loading" clearable>
									<el-option v-for="(item,index) in validList" :key="index" :label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>

							<el-form-item label="排序" prop="sorts">
								<el-input v-model="listQueryAdd.sorts" min="1" type="number" placeholder="仅对专题列表内展示有效" />
							</el-form-item>
						</div>
						<div class="card-box">
							<el-form-item label="样式列表" prop="listStyle">
								<el-select class="selected-input" v-model="listQueryAdd.listStyle" placeholder="请选择样式列表" clearable value-key="name">
									<el-option v-for="(item,index) in listStyleOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item style="visibility: hidden;height: 0;">
								<el-input></el-input>
							</el-form-item>
							<el-form-item prop="time" label="有效时间">
								<el-date-picker v-model="value0" type="datetimerange" :picker-options="pickerOptions" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" align="left" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm" @change="pickedTime0">
								</el-date-picker>
							</el-form-item>
						</div>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancleCreate">取消</el-button>
					<el-button type="primary" @click="saveCreate">保存</el-button>
				</div>
			</el-dialog>

			<el-dialog custom-class="batchAdd-dialog" title="编辑卡片" :visible.sync="cardEditVisible">
				<div class="filter-container">
					<el-form ref="colloctForm" :rules="subRules" :model="cardEditInit" label-position="left" label-width="100px">
						<div class="card-box">
							<el-form-item label="卡片名称" prop="name">
								<el-input v-if="cardEditInit.name=='热门食谱'" v-model="cardEditInit.name" placeholder="请输入卡片名称" class="card-input" clearable disabled/>
								<el-input v-else v-model="cardEditInit.name" placeholder="请输入卡片名称" class="card-input" clearable/>
							</el-form-item>
							<el-form-item label="所属展位" prop="position">
								<el-select class="selected-input" v-model="cardEditInit.position" placeholder="请选择展示位置" clearable value-key="name">
									<el-option v-for="(item,index) in positionOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="卡片类型" prop="listType">
								<el-select class="selected-input" v-model="cardEditInit.listType" placeholder="请选择卡片类型" clearable value-key="name">
									<el-option v-for="(item,index) in listTypeOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="专题类型" prop="subjectType">
								<el-select class="selected-input" v-model="cardEditInit.subjectType" placeholder="请选择专题类型" clearable value-key="name">
									<el-option v-for="(item,index) in subjectTypeOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="内容名称" prop="subjectId">
								<el-select v-model="cardEditInit.subjectId" filterable remote placeholder="请输入内容名称" v-loadmore="loadmore" :remote-method="searchText" :loading="loading" clearable>
									<el-option v-for="(item,index) in validList" :key="index" :label="item.name" :value="item.value" />
								</el-select>
							</el-form-item>

							<el-form-item label="排序" prop="sorts">
								<el-input v-model="cardEditInit.sorts" min="1" type="number" placeholder="仅对专题列表内展示有效" />
							</el-form-item>
						</div>
						<div class="card-box">
							<el-form-item label="样式列表" prop="listStyle">
								<el-select class="selected-input" v-model="cardEditInit.listStyle" placeholder="请选择样式列表" clearable value-key="name">
									<el-option v-for="(item,index) in listStyleOption" :key="index" :label="item.name" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item style="visibility: hidden;height: 0;">
								<el-input></el-input>
							</el-form-item>
							<el-form-item prop="time" label="有效时间">
								<el-date-picker v-model="value1" type="datetimerange" :picker-options="pickerOptions" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" align="left" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm" @change="pickedTime1">
								</el-date-picker>
							</el-form-item>
						</div>
					</el-form>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancleEdit">取消</el-button>
					<el-button type="primary" @click="saveEdit">保存</el-button>
				</div>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	import {
		getSubjectList,
		getSubjectListByName,
		createCardPos,
		editCardPos,
		stopCardPos,
		deleteCardPos
	} from "@/api/cardPos.js";
	import Pagination from "@/components/Pagination";
	var index = 1;
	var savedText = undefined;
	//控制已无多余数据的查询
	var allowSearch = true;
	//保存专题id
	var subjectId = undefined;
	export default {
		components: {
			Pagination
		},
		data: () => ({
			total: 0,
			cardAddVisible: false,
			loading: false,
			listQueryAdd: {
				name: null,
				position: 1,
				listType: 1,
				subjectType: 1,
				subjectId: null,
				listStyle: 1,
				startTime: null,
				endTime: null,
				sorts: 1,
			},
			cardEditVisible: false,
			cardEditInit: {
				name: null,
				position: null,
				listType: null,
				subjectType: null,
				subjectId: null,
				listStyle: null,
				startTime: null,
				endTime: null,
				sorts: null,
			},
			navIndex: 0,
			navOption: ['食谱推荐区', 'banner区'],
			listData: null,
			listQuery: {
				name: null,
				statusType: null,
				listType: null,
				page: 1,
				page_size: 10
			},
			cardOptions: [{
				name: '列表卡片',
				value: 1,
			}, {
				name: 'banner卡片',
				value: 2,
			}],
			statusOptions: [{
				name: '未开始',
				value: 1,
			}, {
				name: '进行中',
				value: 2,
			}, {
				name: '已失效',
				value: 3,
			}],
			positionOption: [{
				name: '食谱推荐区',
				value: 1
			}, {
				name: 'banner展示区',
				value: 2
			}],
			listTypeOption: [{
				name: '列表卡片',
				value: 1
			}, {
				name: 'banner卡片',
				value: 2
			}],
			subjectTypeOption: [{
				name: '食谱专题',
				value: 1
			}, {
				name: '食材专题',
				value: 2
			}],
			listStyleOption: [{
				name: '普通',
				value: 1
			}, {
				name: '横滑',
				value: 2
			}],
			validList: [],
			subRules: {
				name: [{
					required: true,
					message: "请输入卡片名称",
					trigger: "change"
				}],
				position: [{
					required: true,
					message: "请选择卡片位置",
					trigger: "blur"
				}],
				listType: [{
					required: true,
					message: "请选择卡片类型",
					trigger: "blur"
				}],
				subjectType: [{
					required: true,
					message: "请选择专题类型",
					trigger: "blur"
				}],
				contentName: [{
					required: true,
					message: "请选择专题类型",
					trigger: "blur"
				}],
				subjectId: [{
					required: true,
					message: "请选择专题名称",
					trigger: "blur"
				}],
				sorts: [{
					required: true,
					message: "请输入排序",
					trigger: "blur"
				}],
				listStyle: [{
					required: true,
					message: "请选择列表样式",
					trigger: "blur"
				}],
				startTime: [{
					required: false,
					message: "请选择开始时间",
					trigger: "blur"
				}],
				endTime: [{
					required: false,
					message: "请选择结束时间",
					trigger: "blur"
				}],
			},
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
			value2: '',
			value0: [],
			value1: [],
		}),
		computed: {

		},
		created() {

			this.getList()
		},
		methods: {
			pickedTime0(val) {
				let data = this.listQueryAdd;
				let arr = this.value0;
				if(!val) {
					delete data.startTime;
					delete data.endTime
				} else {
					data.startTime = arr[0];
					data.endTime = arr[1];
				}
			},
			pickedTime1(val) {
				let data = this.cardEditInit;
				let arr = this.value1;
				if(!val) {
					delete data.startTime;
					delete data.endTime
				} else {
					data.startTime = arr[0];
					data.endTime = arr[1];
				}
			},
			pickedTime2(val) {
				if(!val) {
					delete this.listQuery.startTime
					delete this.listQuery.endTime
				} else {
					this.listQuery.startTime = val[0];
					this.listQuery.endTime = val[1];
				}
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
				getSubjectListByName({
					page: index,
					page_size: 100,
					name: Tex
				}).then(res => {
					self.loading = false;
					if(!allowSearch) return;
					let data = res.data;
					if(!data.total) {
						var left = data.length - 100 * index;
					} else {
						var left = res.data.total - 100 * index;
					}
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
			getText(data) {
				if(data == 1) {
					return '食谱专题'
				} else if(data == 2) {
					return 'banner'
				}
			},
			getSatus(data) {
				let result = '';
				if(data == 1) {
					result = '未开始'
				} else if(data == 2) {
					result = '进行中'
				} else if(data == 3) {
					result = '已失效'
				}
				return result
			},
			getBtnType(data) {
				let result = '';
				if(data == 1) {
					result = 'primary'
				} else if(data == 2) {
					result = 'warning'
				} else if(data == 3) {
					result = 'info'
				}
				return result
			},
			toDel(id) {
				this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						deleteCardPos({
							id: id
						}).then(res => {
							this.handleFilter()
							this.$message({
								type: "info",
								message: "删除成功"
							});
						}, err => {})
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});
			},
			toStop(itm, id, status) {
				var text = status == 1 ? '停用' : '启用';
				status = status == 1 ? '0' : '1';
				this.$confirm("确定" + text + '该卡片吗？', "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let param = {
							id: id,
							status: status
						}
						stopCardPos(param).then(res => {
							itm.status = status
							this.$message({
								type: "success",
								message: text + "成功!"
							});
						}, err => {})
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除"
						});
					});

			},
			toEdit(itm) {
				var self = this;
				var data = this.cardEditInit = JSON.parse(JSON.stringify(itm));
				this.value1 = [data.startTime, data.endTime];

				var temp = itm.subjectName + '：ID ' + itm.subjectId;
				this.cardEditInit.subjectId = temp;
				this.cardEditVisible = true;
			},
			toCreate() {
				this.listQueryAdd = {
					name: null,
					position: 1,
					listType: 1,
					subjectType: 1,
					subjectId: null,
					listStyle: 1,
					startTime: null,
					endTime: null,
					sorts: 1,
				};
				this.validList = []
				this.cardAddVisible = true;
			},
			cancleEdit() {
				this.cardEditVisible = false;
			},
			cancleCreate() {
				this.cardAddVisible = false;
			},
			saveCreate() {
				let data = this.listQueryAdd;
				let arr = this.value0;
				data = JSON.parse(JSON.stringify(data))
				if(arr !== null && arr.length != 0) {
					data.startTime = arr[0];
					data.endTime = arr[1];
				} else {
					delete data.startTime;
					delete data.endTime
				}
				this.$refs["colloctForm"].validate(valid => {
					if(valid) {
						createCardPos(data).then((res) => {
							this.getList();
							this.cardAddVisible = false;
						}, (err) => {
							this.cardAddVisible = false;
						})
					}
				});
			},
			saveEdit() {
				let data = this.cardEditInit;
				var ind = data.subjectId.toString().indexOf('ID');
				let arr = this.value1;
				if(ind != -1) {
					var temp = data.subjectId.substr(ind + 2).trim();
					this.cardEditInit.subjectId = temp;
				}
				data = JSON.parse(JSON.stringify(data))
				if(arr !== null && arr.length != 0) {
					data.startTime = arr[0];
					data.endTime = arr[1];
				} else {
					//					delete data.startTime;
					//					delete data.endTime
					data.startTime = ''
					data.endTime = ''
				}
				//console.log(data);return;
				delete data.statusMsg;
				delete data.statusType;
				delete data.subjectName;
				delete data.updateTime;
				delete data.createTime
				editCardPos(data).then(res => {
					this.getList();
					this.cardEditVisible = false;
				}, err => {
					this.cardEditVisible = false;
				})
			},
			getList(data) {
				if(!data) {
					var data = JSON.parse(JSON.stringify(this.listQuery));
					for(let k in data) {
						if(!data[k]) {
							delete data[k]
						}
					}
				}
				getSubjectList(data).then(res => {
					this.listData = res.data.data;
					this.total = res.data.total;
				}, err => {
					console.log(err)
				})
			},
			handleFilter() {
				let data = JSON.parse(JSON.stringify(this.listQuery));
				for(let k in data) {
					if(!data[k]) {
						delete data[k]
					}
				}
				this.getList(data)
			},
			navClicked(index) {
				this.navIndex = index;
			}
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
	
	.card-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		text-align: right;
		/*width: calc( 100% - 20px);*/
		/*padding: 0 80px 0 40px;*/
		/*padding-right: 40px;*/
		.el-input,
		.el-textarea,
		.el-select,
		.el-input,
		{
			width: 240px;
		}
		.el-form-item {
			margin: 10px;
		}
	}
	
	.btn-nav {
		display: flex;
		justify-content: flex-start;
		margin-top: 80px;
		position: relative;
	}
	
	.common {
		border: 1px solid #aaa;
		padding: 10px;
		text-align: center;
		width: 120px;
		background-color: #aaa;
	}
	
	.navActive {
		background-color: #fff;
		border-bottom: none;
	}
	
	.creat-card {
		position: absolute;
		right: 0;
	}
	
	.list-box {
		margin-top: 20px;
		min-height: calc(56vh - 30px);
	}
	
	.list-itm {
		border: 1px solid #ccc;
		background-color: #eee;
		position: relative;
		height: 136px;
		margin-bottom: 30px;
	}
	
	.rect-icon {
		width: 36px;
		height: 36px;
		line-height: 36px;
		background-color: #000;
		text-align: center;
		color: #fff;
		position: absolute;
		left: 0;
		top: 0;
	}
	
	.itm-body {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-start;
		height: 136px;
		padding: 10px 0;
		padding-left: 50px;
	}
	
	.itm-title {
		color: #2073cf;
	}
	
	.itm-info {
		font-size: 12px;
	}
	
	.right-status {
		position: absolute;
		top: 0;
		right: 0;
		border-radius: 0;
	}
	
	.btn-operate {
		padding: 6px;
		padding-left: 20px;
		color: #2073cf;
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
	/*.el-date-range-picker.has-sidebar {
		left: 74px!important;
	}*/
	
	.el-form-item__label {
		text-align: right!important;
	}
	
	.el-dialog {
		min-width: 420px;
	}
</style>