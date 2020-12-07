<template>
	<div class="container">
		<el-card>
			<el-dialog custom-class="p-dialog" title="添加专题" :visible.sync="isShow" :before-close="handleClose">
				<!--添加专题-->
				<el-form ref="colloctForm" :rules="subRules" :model="colloctTemp" label-position="left" label-width="100px" style="padding: 0 10px;">
					<div class="bot-box">

						<div class="bgdiv">专题信息</div>
						<div style="padding: 10px 20px;">
							<el-form-item label="专题名称" prop="name">
								<el-input v-model="colloctTemp.name" type="textarea" :rows="1" placeholder="请输入专题名称" />
							</el-form-item>
							<el-form-item label="排序号" prop="sorts" style="max-width: 320px;">
								<el-input v-model="colloctTemp.sorts" min="1" type="number" placeholder="仅对专题列表内展示有效" />
							</el-form-item>
							<el-form-item label="专题简介" prop="introduction">
								<el-input v-model="colloctTemp.introduction" type="textarea" :rows="3" placeholder="请添加一段简介文字" />
							</el-form-item>
							<el-form-item label="专题描述" prop="description">
								<el-input v-model="colloctTemp.description" type="textarea" :min-rows="5" placeholder="一段描述文字" />
							</el-form-item>
						</div>

					</div>

					<div class="bot-box">

						<div class="bgdiv">专题图片</div>
						<div class="botflex" style="padding: 10px 10px;">
							<el-form-item style="min-height: 80px;margin-left: 0;">
								<div>上传缩略图</div>
								<el-upload ref="elupload" name="imageUrl" :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :class="[uploadDisabled?'disabled':'']" :limit="1" :on-success="uploadImgSuccess" :on-exceed="uploadExceed">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
							<el-form-item style="min-height: 80px;margin-left: 0;">
								<div>上传详情图</div>
								<el-upload ref="elupload2" name="imageUrl" :action="uploadUrl" list-type="picture-card" :on-preview="handlePictureCardPreview2" :on-remove="handleRemove2" :class="[uploadDisabled?'disabled':'']" :limit="1" :on-success="uploadImgSuccess2"  :on-exceed="uploadExceed">
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
			<el-dialog :visible.sync="dialogVisible">
				<img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>
			<el-dialog :visible.sync="dialogVisible2">
				<img width="100%" :src="dialogImageUrl2" alt="">
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
	import { getToken } from "@/utils/auth";
	import { addRecipes, uploadImg } from "@/api/recipesConfig.js";
	//上传防抖
	var allowUpload = true;
	export default {
		data: () => ({
			uploadUrl: 'https://fridge-api.mideav.com/admin/RecipeSubject/uploadFile',
			uploadDisabled: false,
			dialogImageUrl: '',
			dialogImageUrl2: '',
			dialogVisible: false,
			dialogVisible2: false,
			colloctTemp: {
				sorts: "",
				source: 3,
				status: 0,
				name: "",
				type: 1,
				introduction: "",
				description: "",
				image: "",
				infoImage: ""
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
		}),
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
		},
		computed: {
			uploadParam() {
				let param = {
					token: getToken()
				};
				return param;
			},
		},
		watch: {
			isShow: {
				handler: function(nv, ov) {
					this.colloctTemp = {
						sorts: "",
						source: 3,
						status: 0,
						name: "",
						type: 1,
						introduction: "",
						description: "",
						image: "",
						infoImage: ""
					}
					this.$nextTick(() => {
						this.$refs["colloctForm"].clearValidate();						
						this.$refs.elupload.clearFiles();
						this.$refs.elupload2.clearFiles();
					});
				},
				immediate: false
			}
		},
		methods: {
			createCollect() {
				var self = this;
				this.$refs["colloctForm"].validate(valid => {
					if(valid) {
						addRecipes(self.colloctTemp).then((res) => {
							self.$emit('closed', 1);
						}, (err) => {
							console.log(err)
						})
					}
				});
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handlePictureCardPreview2(file) {
				this.dialogImageUrl2 = file.url;
				this.dialogVisible2 = true;
			},
			//			handleLimit(file, fileList) {
			//				alert(2)
			////				if(allowUpload) {
			////					var param={
			////						imageUrl:fileList[0].url,
			////						token:this.uploadParam.token
			////					}
			////					allowUpload = false;
			////					uploadImg(param).then((res)=>{
			////						alert(1)
			////						allowUpload = true;
			////					},(err)=>{
			////						alert(0)
			////						allowUpload = true;
			////					})
			////				}
			////				console.log(fileList)
			//				//				if(fileList.length >= 1) {
			//				//					this.uploadDisabled = true;
			//				//				} else {
			//				//					this.uploadDisabled = false;
			//				//				}
			//			},
			handleRemove(file, fileList) {
				this.uploadDisabled = false;
			},
			handleRemove2(file, fileList) {
				this.uploadDisabled2 = false;
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
				if(response.code == 0) {
					var image = response.data.imgUrl;
					this.colloctTemp.image = image;
				} else {
					this.$message({
						type: "info",
						message: "上传失败，" + response.msg,
						duration: 2000
					});
					this.colloctTemp.image = '';
					this.$refs.elupload.clearFiles();
				}
			},
			uploadImgSuccess2(response, file, fileList) {
				if(response.code == 0) {
					var infoImage = response.data.imgUrl;
					this.colloctTemp.infoImage = infoImage;
				} else {
					this.$message({
						type: "info",
						message: "上传失败，" + response.msg,
						duration: 2000
					});
					this.colloctTemp.infoImage = '';
					this.$refs.elupload2.clearFiles();
				}
			},
			/**
			 * @description: 删除已上传图片
			 */
			uploadImgRemove(file, fileList) {
//				console.log(file, fileList)
			},
			/**
			 * @description: 上传图片预览
			 * @param file
			 */
			handleUploadImgPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogImgPreviewVisible = true;
			},
			uploadExceed(files, fileList) {
				this.$message.error("图片只能上传一张，请先删除再上传！");
			},
			handleTabClick() {}

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