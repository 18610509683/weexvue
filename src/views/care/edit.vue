<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      label-position="left"
    >
      <sticky :z-index="10" :class-name="'sub-navbar '+pageStatus">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="goback">取消</el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm">保存</el-button>
      </sticky>

      <div class="divider">基础信息</div>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label-width="100px"
              label="关怀类型:"
              class="postInfo-container-item"
              prop="type"
            >
              <el-select v-model="postForm.type" placeholder="请选择类型">
                <el-option
                  v-for="(item,index) in sourceOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 20px;" prop="title" label-width="100px" label="消息标题:">
          <el-input
            v-model="postForm.title"
            :rows="1"
            type="text"
            autosize
            placeholder=""
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;" prop="content" label-width="100px" label="消息内容:">
          <el-input
            v-model="postForm.content"
            :rows="1"
            type="text"
            autosize
            placeholder=""
          />
        </el-form-item>

        <el-row v-if="postForm.type === 2">
          <el-col :span="8">
            <el-form-item
              label-width="100px"
              label="触发条件："
              class="postInfo-container-item"
            >
              <div>
                <!--<div :key="index" v-for="(item,index) in conditionList" style="margin-bottom: 10px">-->
                <!--&lt;!&ndash;<el-cascader&ndash;&gt;-->
                <!--&lt;!&ndash;v-model="item.value"&ndash;&gt;-->
                <!--&lt;!&ndash;placeholder="关键字搜索"&ndash;&gt;-->
                <!--&lt;!&ndash;:options="bigType"&ndash;&gt;-->
                <!--&lt;!&ndash;@change="weatherChange"&ndash;&gt;-->
                <!--&lt;!&ndash;filterable></el-cascader>&ndash;&gt;-->
                <!--&lt;!&ndash;<span class="el-icon-plus add-btn" @click="addCondition" v-if="index===0"></span>&ndash;&gt;-->
                <!--&lt;!&ndash;<span class="el-icon-minus add-btn" @click="deleteCondition(index)" v-if="index!==0"></span>&ndash;&gt;-->
                <!--</div>-->
                <el-select style="width: 200px;" v-model="postForm.condition">
                  <el-option
                    v-for="(item,index) in allConditions"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </div>

              <!--<div v-if="postForm.type === 1">-->
                <!--<el-select style="width: 200px;" v-model="holidayCondition">-->
                  <!--<el-option-->
                    <!--v-for="(item,index) in holidayList"-->
                    <!--:key="index"-->
                    <!--:label="item.name"-->
                    <!--:value="item.id"-->
                  <!--/>-->
                <!--</el-select>-->
                <!--<el-select style="width: 200px;" v-model="holidayConditionDate">-->
                  <!--<el-option label="前三天" value="1" />-->
                  <!--<el-option label="前两天" value="2" />-->
                  <!--<el-option label="前一天" value="3" />-->
                  <!--<el-option label="当天" value="4" />-->
                <!--</el-select>-->
              <!--</div>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18">
            <el-form-item
              label-width="100px"
              label="提醒时间:"
              class="postInfo-container-item"
              prop="timeRange"
              :required="postForm.type == 1 ? true : false"
            >
              <el-date-picker
                v-model="dateRangeTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right">
              </el-date-picker>
              <p class="remark">说明：在设定时间段内，点亮冰箱时展示提醒，否则不展示。若未设置时间段默认不受时间段限制，即在满足触发条件得前提下点亮冰箱即显示提醒。</p>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              style="margin-bottom: 40px;min-height: 148px;"
              label-width="100px"
              label="缩略图(190x190)"
              prop="image"
              ref="uploadFormItem"
            >
              <el-upload
                name="enclosure"
                action="https://fridge-api2.mideav.com/admin/HolidayPush/uploadFile"
                :file-list="uploadImgList"
                :on-preview="handleUploadImgPreview"
                :on-remove="uploadImgRemove"
                :on-success="uploadImgSuccess"
                :on-exceed="uploadExceed"
                :before-upload="beforeUpload"
                :data="uploadParam"
                :limit="1"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item
              label-width="100px"
              label="展示位置:"
              class="postInfo-container-item"
              prop="timeRange"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="1">屏保页</el-checkbox>
                <el-checkbox label="2">首页顶部机器人</el-checkbox>
                <el-checkbox label="3">美居</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="divider">关联内容</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px">
          <el-col :span="20">
            <el-form-item
              label-width="100px"
              label="内容类型:"
              class="postInfo-container-item"
            >
              <el-select v-model="relationType" placeholder="请选择类型">
                <el-option
                  v-for="(item,index) in contentType"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" v-if="relationType != 2">
            <el-form-item
              label-width="100px"
              label="选择内容:"
              class="postInfo-container-item"
            >
              <el-select v-model="relationValue"
                         remote
                         filterable
                         :remote-method="remoteMethod"
                         :loading="loading"
                         placeholder="请选择内容">
                <el-option
                  v-for="(item,index) in contentOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="relationType == 2">
            <el-form-item
              style="margin-bottom: 40px;min-height: 148px;"
              label-width="100px"
              label="图片(930x535)"
              :before-upload="event => beforeUpload(event,'930','535')"
              prop="image"
              ref="uploadFormItem"
            >
              <el-upload
                name="enclosure"
                action="https://fridge-api2.mideav.com/admin/HolidayPush/uploadFile"
                :file-list="uploadImgRelationList"
                :on-preview="handleUploadImgPreview"
                :on-remove="uploadImgRemove"
                :on-success="uploadRelationSuccess"
                :on-exceed="uploadExceed"
                :data="uploadParam"
                :limit="1"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="divider">推荐对象</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px">
          <el-col :span="20">
            <el-form-item
              label-width="100px"
              label="内容类型:"
              class="postInfo-container-item"
              prop="recommendType"
              :required="postForm.type == 3 ? true :false"
            >
              <el-checkbox-group v-model="recommend">
                <el-checkbox label="1">按用户特征</el-checkbox>
                <!--<el-radio :label="2">按冰箱型号</el-radio>-->
                <!--<el-radio :label="3">按地域</el-radio>-->
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item
              label-width="100px"
              label="选择内容:"
              class="postInfo-container-item"
            >
              <el-checkbox v-model="isAllSelected" :disabled="isDisabled" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="recommendContent">
                <el-checkbox :label="item.value" :key="index" v-for="(item,index) in userFeatureList" :disabled="item.select">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getItem,
  updateItem,
  getCookDetail,
  getUserFeature,
  getAllWeatherCondition
} from "@/api/care.js";
import {
  getAll
} from "@/api/holiday.js";

import Sticky from "@/components/Sticky"; // 粘性header组件
// import { fetchArticle } from '@/api/article'
// import { searchUser } from '@/api/remote-search'
import { getToken } from "@/utils/auth";

const defaultForm = {
  id: null,
  type: null,
  title: '',
  content: '',
  condition: null,
  side_condition: null,
  start_time: '',
  end_time: '',
  image: '',
  show_position: '',
  relation_type: '',
  relation_value: '',
  recommend_type: '',
  recommend_content: '',
  timeRange: [],
  recommendType: ''
};

export default {
  name: 'CareAdd',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateTime = (rule, value, callback) => {
      if (value && value.length <= 0 && this.postForm.type == 1) {
        callback(new Error('请输入提醒时间'))
      } else {
        callback();
      }
    }

    const validateRecommendType = (rule, value, callback) => {
      if (value === '' && this.postForm.type == 3) {
        callback(new Error('请选择推荐人群'))
      } else {
        callback();
      }
    }
    return {
      pageStatus: 'draft',
      checkList: ['1', '2'],
      recommend: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        timeRange: [{ validator: validateTime }],
        recommendType: [{ validator: validateRecommendType }],
        type: [{ required: true, message: '请选择类型' }],
        content: [{ required: true, message: '请输入消息内容' }],
        image: [{ required: true, message: '请上传缩略图' }]
      },
      dateRangeTime: '',
      relationType: 1,
      holidayCondition: '',
      holidayConditionDate: '',
      holidayList: [],
      recommendContent: [],
      allConditions: [],
      dialogStatus: '',
      collectTextMap: {
        update: '编辑',
        create: '新增'
      },
      dialogCollectVisible: false,
      tempRoute: {},
      dialogImageUrl: '',
      dialogImgPreviewVisible: false,
      uploadImgList: [],
      uploadImgRelationList: [],
      weatherCondition: '',
      sourceOptions: [
        {
          name: '节日',
          value: 1
        },
        {
          name: '天气',
          value: 2
        },
        {
          name: '人群',
          value: 3
        }
      ],
      contentType: [
        {
          name: '食谱详情',
          value: 1
        },
        {
          name: '图片',
          value: 2
        }
      ],
      contentOptions: [],
      conditionList: [
        {
          'relation': '',
          'value': ''
        }
      ],
      userFeatureList: [],
      relationEditValue: '',
      relationOriginValue: '',
      relationValue: '',
      isAllSelected: false,
      isDisabled: true
    };
  },
  watch: {
    recommend(value) {
      if (value[0] == '1') {
        this.userFeatureList = this.userFeatureList.map(item => {
          return { value: item.value, name: item.name, select: false }
        })
        this.isDisabled = false
      } else {
        this.userFeatureList = this.userFeatureList.map(item => {
          return { value: item.value, name: item.name, select: true }
        })
        this.isDisabled = true
      }
      if (value != '') {
        this.postForm.recommendType = value
      }
    },
    dateRangeTime(value) {
      if (value[0] && value.length > 0) {
        this.postForm.timeRange = value
      }
    },
    recommendContent(value) {
      if (value.length < this.userFeatureList.length) {
        this.isAllSelected = false
      } else {
        this.isAllSelected = true
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    uploadParam() {
      let param = {
        token: getToken()
      }
      return param
    }
  },
  created() {
    const id = this.$route.query.id
    this.getUserFeatureList()
    this.getDetail(id)
    this.getAllHoliday()
    this.getAllConditions()
  },
  methods: {
    beforeUpload(file,imgWidth = 190,imgHeight = 190) {
      const _this = this
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = function(event) {
          const image = new Image()
          image.onload = function() {
            const width = this.width
            const height = this.height
            if (width != imgWidth && height != imgHeight) {
              _this.$alert('图片尺寸为' + imgWidth + "*" + imgHeight, '提示', {confirmButtonText: '确定'})
              reject()
            }
            resolve()
          }
          image.src = event.target.result
        }
        reader.readAsDataURL(file)
      })
    },
    handleCheckAllChange() {
      if (!this.isAllSelected) {
        this.recommendContent = []
      } else {
        this.recommendContent = this.userFeatureList.map(item => {
          return item.value
        })
      }
    },
    getDetail(id) {
      getItem({ id: id }).then(res => {
        const data = res.data
        this.postForm = res.data
        this.relationType = data.relation_type
        this.holidayCondition = data.condition
        this.holidayConditionDate = data.side_condition.toString()
        this.relationValue = data.recommend_value
        this.checkList = data.show_position
        if (data.start_time && data.end_time) {
          this.dateRangeTime = [new Date(data.start_time), new Date(data.end_time)]
        }
        if (data.recommend_type.length > 0) {
          this.recommend = data.recommend_type
          this.userFeatureList = this.userFeatureList.map(item => {
            return { value: item.value, name: item.name, select: false }
          })
          this.isDisabled = false
        }
        if (data.recommend_content && data.recommend_content.length > 0) {
          if (data.recommend_content.length >= this.userFeatureList.length) {
            this.isAllSelected = true
          }
          this.recommendContent = data.recommend_content
        }
        if (data.image) {
          this.uploadImgList = [{ 'url': data.image }]
        }
        if (data.relation_type === 2 && data.relation_value) {
          this.uploadImgRelationList = [{ 'url': data.relation_value }]
        }
      })
    },
    getAllConditions() {
      getAllWeatherCondition().then(res => {
        this.allConditions = res.data
      })
    },
    getUserFeatureList() {
      getUserFeature().then(res => {
        this.userFeatureList = res.data
      })
    },
    remoteMethod(query) {
      const self = this
      if (query !== '') {
        self.loading = true
        getCookDetail({
          'name': query
        }).then(res => {
          self.contentOptions = res.data
          self.loading = false
        })
      } else {
        this.contentOptions = [];
      }
    },
    getAllHoliday() {
      getAll().then(res => {
        this.holidayList = res.data
      })
    },
    submitForm() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          const nowFrom = {
            'start_time': this.dateRangeTime[0],
            'end_time': this.dateRangeTime[1],
            'relation_type': this.relationType,
            'show_position': JSON.stringify(this.checkList),
            'recommend_type': this.recommend.length > 0 ? JSON.stringify(this.recommend) : '',
            'recommend_content': this.recommendContent.length > 0 ? JSON.stringify(this.recommendContent) : ''
          }
          if (this.postForm.relation_type == 1 && this.relationValue != this.postForm.recommend_value) {
            nowFrom.relation_value = this.relationValue
          }

          this.postForm = Object.assign(this.postForm, nowFrom)
          updateItem(this.postForm).then(res => {
            this.$router.go(-1); //返回上一层
            this.$notify({
              title: "成功",
              message: "已成功编辑",
              type: "success",
              duration: 1000
            })
          })
        }
      })
    },
    goback() {
      this.$confirm('退出页面不会保存已编辑内容, 是否继续退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.go(-1); //返回上一层
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },

    /**
     * @description: 上传成功
     */
    uploadImgSuccess(response, file, fileList) {
      if (fileList.length > 0) {
        this.postForm.image = response.data.url;
        console.log(this.postForm.image)
        this.$refs['uploadFormItem'].clearValidate()
      } else {
        this.postForm.image = ''
      }
    },
    uploadRelationSuccess(response, file, fileList) {
      if (fileList.length > 0) {
        this.postForm.relation_value = response.data.url
        this.$refs['uploadFormItem'].clearValidate()
      } else {
        this.postForm.relation_value = ''
      }
    },
    /**
     * @description: 删除已上传图片
     */
    uploadImgRemove(file, fileList) {
      this.postForm.image = '';
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
      this.$message.error('图片只能上传一张，请先删除再上传！')
    },
    handleTabClick() {},

    deleteCondition(index) {
      this.conditionList.splice(index, 1)
    },

    handleSelect(item) {
      // console.log(item)
      this.colloctTemp.id = item.id;
      this.colloctTemp.name = item.name;
    },
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .form-item-title {
    font-size: 15px;
    color: #606266;
    font-weight: bold;
  }
  .el-form-item__label {
    font-size: 15px;
  }
  .createPost-container {
    position: relative;
    background: white;

    .createPost-main-container {
      padding: 5px 45px 5px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
  .divider {
    padding: 15px 45px;
    font-weight: bold;
    color: #333;
    border-bottom: 1px solid #cacaca;
  }
  .el-select {
    width: calc(100% - 50px);
  }
  .baikeTextarea {
    width: calc(100% - 30px);
  }
  .p-dialog {
    border-radius: 5px;
  }
  .colloct-header {
    display: flex;
    height: 28px;
    .colloct-title {
      flex: 1;
    }
    .colloct-add {
    }
  }
  .remark{
    color: #99a9bf;
    font-size: 14px;
  }
</style>
<style lang="scss">
  .createPost-container {
    .el-form-item__label {
      font-size: 15px;
    }
    .el-tag--info,
    .el-tag--info .el-tag__close {
      color: #454545;
    }
    .el-select .el-tag {
      background-color: #e8e8e8;
    }
  }

  .add-btn {
    padding: 5px;
    border:1px solid #999;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 5px;
    margin-left: 10px;
  }
</style>
