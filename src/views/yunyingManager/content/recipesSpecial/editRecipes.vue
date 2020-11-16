<template>
	<div class="container">
		<el-card>
			<el-dialog custom-class="p-dialog" title="编辑专题" :visible.sync="isShow" :before-close="handleClose">
				<!--编辑专题-->
				<el-form ref="colloctForm" :rules="subRules" :model="colloctTemp" label-position="left" label-width="100px" style="padding: 0 10px;">
					<div class="bot-box">

						<div class="bgdiv">专题信息</div>
						<div style="padding: 10px 20px;">
							<el-form-item label="专题名称" prop="name">
								<el-input v-model="colloctTemp.name" type="textarea" :rows="1" placeholder="请输入专题名称" />
							</el-form-item>
							<div style="overflow: hidden;">
								<el-form-item class="floatLeft" label="排序号" prop="sorts">
									<el-input v-model="colloctTemp.sorts" min="1" type="number" placeholder="仅对专题列表内展示有效" />
								</el-form-item>
								<el-form-item class="floatLeft" label="专题ID" prop="id">
									<el-input v-model="colloctTemp.id" min="1" type="number" placeholder="仅对专题列表内展示有效" disabled v-focus/>
								</el-form-item>
								<el-form-item class="floatLeft" label="来源" prop="source">
									<el-select v-model="colloctTemp.source" placeholder="请选择来源">
										<el-option v-for="(item,index) in sourceOptions" :key="index" :label="item.name" :value="item.value" />
									</el-select>
								</el-form-item>
								<el-form-item class="floatLeft" label="掌厨ID" prop="sorts">
									<el-input v-model="colloctTemp.sorts" min="1" type="number" placeholder="仅对专题列表内展示有效" disabled/>
								</el-form-item>
							</div>

							<el-form-item label="专题简介" prop="introduction">
								<el-input v-model="colloctTemp.introduction" type="textarea" :rows="3" placeholder="请添加一段简介文字" />
							</el-form-item>
							<el-form-item label="专题描述" prop="description">
								<el-input v-model="colloctTemp.description" type="textarea" :min-rows="5" placeholder="一段描述文字" />
							</el-form-item>
						</div>

					</div>
					<!--<div>
						<img class="recipeIcon " :src="colloctTemp.image ">
						<div class="bot-box" style="opacity: 0;">

							<div class="bgdiv">专题图片</div>
							<div class="botflex" style="padding: 10px 10px;">
								<el-form-item style="min-height: 80px;margin-left: 0;">
									<div>上传缩略图</div>
									<el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="handleLimit" :class="[uploadDisabled?'disabled':'']" :limit="1">
										<i class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
								<el-form-item style="min-height: 80px;margin-left: 0;">
									<div>上传详情图</div>
									<el-upload :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="handleLimit" :class="[uploadDisabled?'disabled':'']" :limit="1">
										<i class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</div>
						</div>
					</div>-->

					<div class="bot-box">

						<div class="bgdiv">专题图片</div>
						<div class="botflex" style="padding: 10px 10px;">
							<el-form-item style="min-height: 80px;margin-left: 0;">
								<div>缩略图</div>
								<el-upload name="imageUrl" :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :class="[uploadDisabled?'disabled':'']" :limit="1" :on-success="uploadImgSuccess" :file-list="uploadImgList">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
							<el-form-item style="min-height: 80px;margin-left: 0;">
								<div>详情图</div>
								<el-upload name="imageUrl" :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2" :on-remove="handleRemove2" :class="[uploadDisabled?'disabled':'']" :limit="1" :on-success="uploadImgSuccess2" :file-list="uploadImgList2">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</div>
					</div>

				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancle">取消</el-button>
					<el-button type="primary" @click="createCollect">确定</el-button>
				</div>
			</el-dialog>

		</el-card>

	</div>

</template>

<script>
	import { getToken } from "@/utils/auth";
	import { addRecipes, editRecipes } from "@/api/recipesConfig.js";
	export default {
		data: () => ({
			sourceOptions: [{
				value: 1,
				name: 'IOT'
			}, {
				value: 2,
				name: '掌厨'
			}, {
				value: 3,
				name: '运营编辑'
			}],
			uploadUrl: 'https://fridge-api.mideav.com/admin/RecipeSubject/uploadFile',
			uploadImgList:[],
			uploadImgList2:[],
			uploadDisabled: false,
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
			colloctTemp: {
				sorts: '',
				source: 3,
				status: 0,
				name: '',
				type: 1,
				introduction: '',
				description: '',
				image: '',
				infoImage: '',
				id: '',
				source: '3'
			},
			subRules: {
				name: [{
					required: true,
					message: "请输入专题名称",
					trigger: "change"
				}],
				id: [{
					required: true,
					message: "id不能为空",
					trigger: "blur"
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
			}
		}),
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			editProps: {
				type: Object,
				default: {
					sorts: '',
					source: 3,
					status: 0,
					name: '',
					type: 1,
					introduction: '',
					description: '',
					image: '',
					infoImage: '',
					id: ''
				}
			}
		},
		watch: {
			'editProps.name': {
				handler: function(val, oldval) {
					console.log(this.editProps)
					this.colloctTemp = this.editProps;
					if(this.colloctTemp.image) {
						this.uploadImgList = [{
							url: this.colloctTemp.image
						}];
					} else {
						this.uploadImgList = [];
					}
					if(this.colloctTemp.infoImage) {
						this.uploadImgList2 = [{
							url: this.colloctTemp.infoImage
						}];
					} else {
						this.uploadImgList2 = [];
					}
				}
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
		methods: {
			createCollect() {
				//提交编辑
				var self = this;
				var data = this.colloctTemp;
				for(const key in this.colloctTemp) {
					// 去除对象内多余的空值key
					if(this.colloctTemp[key] === null) {
						delete this.colloctTemp[key];
					}
				}
				this.$refs["colloctForm"].validate(valid => {
					if(valid) {
						var param = {
							token: self.uploadParam.token
						}
						param = Object.assign({}, param, self.colloctTemp);
						//						alert(JSON.stringify(param))
						delete param.createTime;
						delete param.updateTime;
						delete param.cookCount;
						console.log(param)
						editRecipes(param).then((res) => {
							self.$emit('closed', 1);
							console.log(res)
						}, (err) => {
							console.log(err)
							self.$emit('closed', 0);
						})
					}
				});
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleLimit(file, fileList) {
				console.log(fileList)
			},
			handleRemove(file, fileList) {
				this.uploadDisabled = false;
			},
			change(e) {
				//				console.log(e)
			},
			handleClose(done) {
				this.$emit('closed', 0);
			},
			cancle() {
				this.$emit('closed', 0);
			},
			/**
			 * @description: 上传成功
			 */
			uploadImgSuccess(response, file, fileList) {
				var image = response.data.imgUrl;
				this.colloctTemp.image = image;
			},
			uploadImgSuccess2(response, file, fileList) {
				var infoImage = response.data.imgUrl;
				this.colloctTemp.infoImage = infoImage;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handlePictureCardPreview2(file) {
				this.dialogImageUrl2 = file.url;
				this.dialogVisible2 = true;
			},
			handleRemove(file, fileList) {
				this.uploadDisabled = false;
			},
			handleRemove2(file, fileList) {
				this.uploadDisabled2 = false;
			},			
		}
	}
</script>

<style scoped>
	.container {}
	
	.p-dialog {
		border-radius: 5px;
	}
	
	.bot-box {
		border: 1px solid #aaa;
		margin-bottom: 20px;
	}
	
	.bgdiv {
		height: 30px;
		line-height: 30px;
		padding: 0 4px;
		background-color: #eaeaea;
	}
	
	.botflex {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	
	.floatLeft {
		max-width: 320px;
		float: left;
		margin-right: 80px;
	}
</style>
<style>
	.disabled .el-upload--picture-card {
		display: none;
	}
	
	.el-upload--picture-card {}
	
	.botflex .el-form-item__content {
		margin-left: 0px!important;
	}
	
	.el-dialog__body {
		padding-top: 0;
	}
	
	.foodincome-con .p-dialog {
		margin-top: 8vh!important;
	}
</style>