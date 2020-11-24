<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left">
      <sticky :z-index="10" :class-name="'sub-navbar '+pageStatus">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="goback">取消</el-button>
        <el-button v-loading="loading" type="warning" @click="submitForm">保存</el-button>
      </sticky>

      <div class="divider">基础信息</div>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" name="name">食谱名称</MDinput>
            </el-form-item>
            <el-form-item
              ref="uploadFormItem"
              style="margin-bottom: 40px;min-height: 148px;"
              label-width="100px"
              label="食谱封面图"
              prop="image"
            >
              <el-upload
                name="img_url"
                :action="'https://fridge-api.mideav.com/admin' + '/rubbish/uploadImg'"
                :file-list="uploadImgList"
                :on-preview="handleUploadImgPreview"
                :on-remove="uploadImgRemove"
                :on-success="uploadImgSuccess"
                :on-exceed="uploadExceed"
                :data="uploadParam"
                :limit="1"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
              </el-upload>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="来源:" class="postInfo-container-item" prop="source">
                    <el-select v-model="postForm.source" placeholder="请选择来源" disabled>
                      <el-option
                        v-for="(item,index) in sourceOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="智能食谱:" class="postInfo-container-item" prop="cookType">
                    <el-select v-model="postForm.cookType" placeholder="请选择智能食谱类型" style="width: 180px;">
                      <el-option
                        v-for="(item,index) in smartFoodOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    label="食谱类型:"
                    class="postInfo-container-item"
                    prop="food_type"
                  >
                    <el-select v-model="postForm.food_type" placeholder="请选择食谱类型">
                      <el-option
                        v-for="(item,index) in foodCGOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label-width="120px" label="适宜份数:" class="postInfo-container-item">
                    <el-input v-model="postForm.unit" placeholder="请输入份数" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="烹饪难度:" class="postInfo-container-item" prop="source">
                    <el-select v-model="postForm.difficultyLevel" placeholder="请选择烹饪难度">
                      <el-option
                        v-for="(item,index) in difficultyOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="IOT食谱ID:" class="postInfo-container-item">
                    <el-input v-model="postForm.thirdId" placeholder="请输入内容" :disabled="true" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="IOT食谱编码:" class="postInfo-container-item">
                    <el-input v-model="postForm.thirdNo" placeholder="请输入内容" :disabled="true" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <!--<el-col :span="8">
                  <el-form-item label-width="120px" label="食材ID:" class="postInfo-container-item" prop="id">
                    <el-input placeholder="食谱ID" v-model="postForm.id" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>-->

              </el-row>

              <el-row>
                <el-col :span="6">
                  <el-form-item label-width="100px" label="烹饪天数:" class="postInfo-container-item" prop="source">
                    <el-select v-model="postForm.days" placeholder="请选择烹饪天数">
                      <el-option
                        v-for="(item,index) in daySelect"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="烹饪时分秒:" class="postInfo-container-item">
                    <el-time-picker
                      v-model="makeTime"
                      format="HH时mm分ss秒"
                      value-format="HH-mm-ss"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="热量:" class="postInfo-container-item">
                    <el-input v-model="postForm.calories" placeholder="请输入热量">
                      <template slot="append">千卡</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="视频食谱:" class="postInfo-container-item" prop="source">
                    <el-select v-model="postForm.isHasVideo" placeholder="是否是视频食谱">
                      <el-option
                        v-for="(item,index) in hasVideoOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <!--                  <el-form-item label-width="120px" label="视频地址:" class="postInfo-container-item">-->
                  <!--                    <el-input style="width: 600px;" v-model="postForm.videoUrl" :disabled="true"></el-input>-->
                  <!--                  </el-form-item>-->
                  <el-upload
                    name="fileUrl"
                    class="upload-demo"
                    action="https://fridge-api2.mideav.com/admin/CookManage/uploadFile"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-success="uploadFileSuccess"
                    multiple
                    :limit="10"
                    :data="uploadParam"
                    :on-exceed="handleExceed"
                    :file-list="uploadVideoList"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!--                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                  </el-upload>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item class="baikeTextarea">
                    <slot name="label">
                      <div class="form-item-title">食谱简介:</div>
                    </slot>
                    <el-input v-model="postForm.introduce" type="textarea" :rows="3" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="baikeTextarea">
                    <slot name="label">
                      <div class="form-item-title">食谱描述:</div>
                    </slot>
                    <el-input v-model="postForm.description" type="textarea" :rows="3" placeholder="请输入内容" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="divider">食谱标签</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px;">
          <el-col :span="12">
            <el-form-item label-width="120px" label="设备品类:">
              <el-select v-model="deviceArr" multiple filterable placeholder="请选择设备品类">
                <el-option
                  v-for="(item,index) in deviceOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="口味:">
              <el-select v-model="tasteArr" multiple filterable placeholder="请选择口味">
                <el-option
                  v-for="(item,index) in tasteOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="烹饪方式:">
              <el-select v-model="cookPatternArr" multiple filterable placeholder="请选择烹饪方式">
                <el-option
                  v-for="(item,index) in cookPatternOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="职业:">
              <el-select v-model="occupationArr" multiple filterable placeholder="请选择职业">
                <el-option
                  v-for="(item,index) in occupationOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="时令:">
              <el-select v-model="seasonArr" multiple filterable placeholder="请选择时令">
                <el-option
                  v-for="(item,index) in seasonOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="节日:">
              <el-select v-model="festivalArr" multiple filterable placeholder="请选择节日">
                <el-option
                  v-for="(item,index) in festivalOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="菜系:">
              <el-select v-model="dishStyleArr" multiple filterable placeholder="请选择菜系">
                <el-option
                  v-for="(item,index) in dishStyleOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="菜式:">
              <el-select v-model="cookStyleArr" multiple filterable placeholder="请选择菜式">
                <el-option
                  v-for="(item,index) in cookStyleOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="适宜人群:">
              <el-select v-model="goodPeopleArr" multiple filterable placeholder="请选择适宜人群">
                <el-option
                  v-for="(item,index) in peopleOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="禁忌人群:">
              <el-select v-model="badPeopleArr" multiple filterable placeholder="请选择禁忌人群">
                <el-option
                  v-for="(item,index) in peopleOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="适宜生理阶段:">
              <el-select v-model="goodPhysioArr" multiple filterable placeholder="请选择适宜生理阶段">
                <el-option
                  v-for="(item,index) in physiologyOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="禁忌生理阶段:">
              <el-select v-model="badPhysioArr" multiple filterable placeholder="请选择禁忌生理阶段">
                <el-option
                  v-for="(item,index) in physiologyOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="适宜疾病:">
              <el-select v-model="goodSickArr" multiple filterable placeholder="请选择适宜疾病">
                <el-option
                  v-for="(item,index) in sickOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="禁忌疾病:">
              <el-select v-model="badSickArr" multiple filterable placeholder="禁忌疾病">
                <el-option
                  v-for="(item,index) in sickOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="120px" label="功效:">
              <el-select v-model="functionArr" multiple filterable placeholder="请选择功效">
                <el-option
                  v-for="(item,index) in functionOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="120px" label="分类:">
              <el-select v-model="recipesCGArr" multiple filterable placeholder="请选择分类">
                <el-option
                  v-for="(item,index) in recipesCGOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="divider">食谱详情</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px;margin-bottom: 40px;">
          <el-tabs v-model="baikeActiveVal" @tab-click="handleTabClick">
            <el-tab-pane label="食谱制作" name="baike1">
              <el-col :span="24">
                <div v-for="(item,index) in tempSteps" :key="index" class="step-cell">
                  <div class="step-cell-hd">步骤{{ index+1 }}</div>
                  <div class="cell-img-con">
                    <!-- event=>slideChange(event,'cool') -->
                    <el-upload
                      v-once
                      list-type="picture-card"
                      name="img_url"
                      :action="'https://fridge-api.mideav.com/admin' + '/rubbish/uploadImg'"
                      :file-list="item.stepImage?[{url:item.stepImage}]:[]"
                      :on-preview="handleUploadImgPreview"
                      :on-remove="(file, fileList) => uploadStepImgRemove(file, fileList, index)"
                      :on-success="(response, file, fileList) => uploadStepImgSuccess(response, file, fileList, index)"
                      :on-exceed="uploadExceed"
                      :data="uploadParam"
                      :multiple="false"
                      :limit="1"
                      style="margin-left: 20px;"
                    >
                      <i class="el-icon-plus" />
                    </el-upload>
                  </div>
                  <div class="step-cell-text">
                    <el-input v-model="item.stepDesc" type="textarea" :rows="4" placeholder="请输入内容" />
                  </div>
                  <div class="sels-con">
                    <el-col :span="12">
                      <el-form-item label-width="100px" label="冰箱烹饪:" class="postInfo-container-item">
                        <el-select v-model="item.type" placeholder="请选择冰箱烹饪类型" @change="cookStepChange(item)">
                          <el-option
                            v-for="(item,index) in smartFoodOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label-width="100px" label="放入冰箱:" class="postInfo-container-item">
                        <el-select v-model="item.position" placeholder="请选择冰箱位置" :disabled="item.type != 1">
                          <el-option
                            v-for="(item,index) in fridgeRoomOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col v-if="item.type == 0 || item.type == 1" :span="12">
                      <el-form-item label-width="100px" label="烹饪时分秒:" class="postInfo-container-item">
                        <el-time-picker
                          v-model="item.duration"
                          format="HH时mm分ss秒"
                          value-format="HH-mm-ss"
                          :disabled="item.type == 0"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col v-if="item.type == 2" :span="12">
                      <el-form-item label-width="100px" label="发酵类型:" class="postInfo-container-item">
                        <el-select v-model="item.fermentType" placeholder="请选择发酵类型">
                          <el-option
                            v-for="(item,index) in fermentTypeOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label-width="100px" label="温度调节:" class="postInfo-container-item">
                        <el-input v-model="item.temperature" style="width: 220px;" :disabled="item.type != 1" />
                      </el-form-item>
                    </el-col>
                  </div>
                  <div class="step-cell-ft">
                    <img src="@/assets/del.png" @click="delStep(index)">
                  </div>
                </div>
                <el-button
                  class="colloct-add"
                  style="margin-top:10px;"
                  type="primary"
                  size="mini"
                  @click="handleCreateStep()"
                >新增
                </el-button>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="食谱材料" name="baike2">
              <el-col :span="24">
                主料：
              </el-col>
              <el-col v-for="item in mainMaterial" :key="item.id" :span="6" style="margin-top:12px;">
                {{ item.name }}&#12288;&#12288;{{ item.weight }}
              </el-col>
              <el-col
                v-if="subMaterial.length>0"
                :span="24"
                style="border-top: 1px solid #d2d2d2;margin-top: 12px;padding-top: 12px;"
              >
                辅料：
              </el-col>
              <el-col v-for="item in subMaterial" :key="item.id" :span="6" style="margin-top:12px;">
                {{ item.name }}&#12288;&#12288;{{ item.weight }}
              </el-col>

            </el-tab-pane>
            <!-- <el-tab-pane label="食谱营养" name="baike3">
              <el-col :span="24">
                3
              </el-col>
            </el-tab-pane> -->
          </el-tabs>
        </el-row>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogImgPreviewVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import {
  createRecipe,
  fetchRecipeDetail,
  fetchAllTag,
  fetchAllRecipesType
} from '@/api/foodManager.js'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
// import { fetchArticle } from '@/api/article'
// import { searchUser } from '@/api/remote-search'
import { getToken } from '@/utils/auth'

const defaultForm = {
  id: null, // 食材id
  name: '', // 食材名称
  image: null, // 食材图片
  unit: null, // 份数
  thirdId: null, // 第三方id
  thirdNo: null, // 第三方食谱编码
  difficultyLevel: null, // 烹饪难度
  source: 3, // 来源
  cookType: null, // 智能食谱类型
  isHasVideo: null, // 是否有视频
  videoUrl: null, // 视频地址
  introduce: null, // 简介
  description: null, // 描述
  cook_duration: null, // 时长
  calories: null, // 热量

  device: null, // 设备
  season: null, // 时令
  festival: null, // 节日
  dishStyle: null, // 菜系
  suitablePeople: null, // 适宜人群
  improperPeople: null, // 禁忌人群
  suitablePhysiology: null, // 生理阶段
  improperPhysiology: null,
  suitableSick: null, // 疾病
  improperSick: null,
  effect: null, // 功效
  category: null, // 分类
  taste: null, // 口味
  cookStyle: null, // 菜式
  cookPattern: null, // 烹饪方式
  occupation: null, // 职业

  step: null, // 烹饪步骤
  material: [], //	烹饪材料

  suitable: '', // 食材适应搭配（JSON字符串）
  improper: '', // 食材不宜搭配 （JSON字符串）

  days: 0,
  hours: null,
  minutes: null,
  seconds: null
}

export default {
  name: 'FoodDetail',
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageStatus: 'draft',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入食材名称', trigger: 'blur' }],
        id: [{ required: true, message: '食材ID', trigger: 'blur' }],
        source: [
          { required: true, message: '请选择食材来源', trigger: 'change' }
        ],
        cookType: [{ required: true, message: '请选择智能食谱类型', trigger: 'change' }],
        image: [{ required: true, message: '请上传食材图片' }]
      },

      refrigTime: null, // 存储时间 int day
      freezeTime: null,

      isGood: true, // 是否是好的搭配
      days: 0, // 烹饪天数
      daySelect: [
        { value: 0, name: '0天' }, { value: 1, name: '1天' }, { value: 2, name: '2天' }, { value: 3, name: '3天' },
        { value: 4, name: '4天' }, { value: 5, name: '5天' }
      ],
      dialogStatus: '',

      tempRoute: {},
      dialogImageUrl: '',
      dialogImgPreviewVisible: false,

      uploadImgList: [],
      uploadVideoList: [],

      sourceOptions: [
        { value: 1, name: 'IOT' }, { value: 2, name: '掌厨' }, { value: 3, name: '运营编辑' }
      ],
      smartFoodOptions: [
        { value: 0, name: '无' }, { value: 1, name: '低温烹饪' }, { value: 2, name: '低温发酵' }
      ],
      fermentTypeOptions: [
        { value: 1, name: '软质面包' }, { value: 2, name: '硬质面包' }, { value: 3, name: '披萨' }, { value: 4, name: '馒头卷' }, { value: 5, name: '包类' }, { value: 6, name: '卷类' }
      ], // 发酵类型
      fridgeRoomOptions: [
        { value: 1, name: '冷藏室' }, { value: 2, name: '冷冻室' }
      ],
      difficultyOptions: [
        { value: 1, name: '简单' }, { value: 2, name: '较简单' }, { value: 3, name: '中等' },
        { value: 4, name: '较困难' }, { value: 5, name: '困难' }
      ],
      hasVideoOptions: [{ value: 1, name: '是' }, { value: 0, name: '否' }],

      seasonArr: [],
      festivalArr: [],
      goodPeopleArr: [],
      badPeopleArr: [],
      goodPhysioArr: [],
      badPhysioArr: [],
      goodSickArr: [],
      badSickArr: [],
      functionArr: [],
      tasteArr: [], // 口味
      dishStyleArr: [], // 菜系
      cookStyleArr: [], // 菜式
      cookPatternArr: [], // 烹饪方式
      deviceArr: [], // 设备品类
      occupationArr: [], // 职业
      recipesCGArr: [], // 食谱分类

      seasonOptions: [],
      festivalOptions: [],
      peopleOptions: [],
      physiologyOptions: [], // 生理阶段
      sickOptions: [], // 疾病
      functionOptions: [], // 功效
      tasteOptions: [], // 口味
      dishStyleOptions: [], // 菜系
      cookStyleOptions: [], // 菜式
      cookPatternOptions: [], // 烹饪方式
      deviceOptions: [], // 设备品类
      occupationOptions: [], // 职业
      recipesCGOptions: [], // 食谱分类

      baikeActiveVal: 'baike1',

      tempSteps: [],
      makeTime: null

    }
  },
  computed: {
    // contentShortLength() {
    //   return this.postForm.content_short.length;
    // },
    uploadParam() {
      const param = {
        token: getToken()
      }
      return param
    },
    mainMaterial() {
      const arr = []
      for (let index = 0; index < this.postForm.material.length; index++) {
        const el = this.postForm.material[index]
        if (el.isMain === 1) { // 主料
          arr.push(el)
        }
      }
      return arr
    },
    subMaterial() {
      const arr = []
      for (let index = 0; index < this.postForm.material.length; index++) {
        const el = this.postForm.material[index]
        if (el.isMain === 2) { // 辅料
          arr.push(el)
        }
      }
      return arr
    }
  },
  created() {
    // 获取季节数据
    fetchAllTag().then(res => {
      // 获取时令季节数据
      this.seasonOptions = res.data[1]
      // 获取节日数据
      this.festivalOptions = res.data[2]
      // 获取适应人群数据
      this.peopleOptions = res.data[3]
      // 获取生理阶段数据
      this.physiologyOptions = res.data[4]
      // 获取功效数据
      this.functionOptions = res.data[5]
      // 获取适宜疾病数据
      this.sickOptions = res.data[6]
      // 获取口味数据
      this.tasteOptions = res.data[7]
      // 获取菜系数据
      this.dishStyleOptions = res.data[8]
      // 获取菜式数据
      this.cookStyleOptions = res.data[9]
      // 获取设备品类数据
      this.deviceOptions = res.data[10]
      // 获取烹饪方式数据
      this.cookPatternOptions = res.data[11]
      // 获取职业数据
      this.occupationOptions = res.data[12]
    })

    // 获取所有食品分类
    fetchAllRecipesType().then(res => {
      this.recipesCGOptions = res.data
    })

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      fetchRecipeDetail({ id }).then(res => {
        const data = res.data
        Object.keys(this.postForm).forEach(key => {
          this.postForm[key] = data[key]
        })
        console.log(this.postForm)

        // tags反赋值
        this.seasonArr = this.tagsObj2Ids(this.postForm.season)
        this.festivalArr = this.tagsObj2Ids(this.postForm.festival)
        this.goodPeopleArr = this.tagsObj2Ids(this.postForm.suitablePeople)
        this.badPeopleArr = this.tagsObj2Ids(this.postForm.improperPeople)
        this.goodPhysioArr = this.tagsObj2Ids(this.postForm.suitablePhysiology)
        this.badPhysioArr = this.tagsObj2Ids(this.postForm.improperPhysiology)
        this.goodSickArr = this.tagsObj2Ids(this.postForm.suitableSick)
        this.badSickArr = this.tagsObj2Ids(this.postForm.improperSick)
        this.functionArr = this.tagsObj2Ids(this.postForm.effect)
        this.tasteArr = this.tagsObj2Ids(this.postForm.taste) // 口味
        this.dishStyleArr = this.tagsObj2Ids(this.postForm.dishStyle) // 菜系
        this.cookStyleArr = this.tagsObj2Ids(this.postForm.cookStyle) // 菜式
        this.cookPatternArr = this.tagsObj2Ids(this.postForm.cookPattern) // 烹饪方式
        this.occupationArr = this.tagsObj2Ids(this.postForm.occupation) // 职业
        this.deviceArr = this.tagsObj2Ids(this.postForm.device) // 设备品类
        this.recipesCGArr = this.tagsObj2Ids(this.postForm.category) // 食谱分类
        console.log(this.tasteArr)
        if (this.postForm.step) {
          this.tempSteps = this.postForm.step
        }

        if (this.postForm.image && this.postForm.image.length > 0) {
          this.uploadImgList = [{ url: this.postForm.image }]
        } else {
          this.uploadImgList = []
        }

        this.uploadVideoList = this.getVideoList(this.postForm.videoUrl) // 食谱视频

        this.postForm.material = data.material

        const hours = this.postForm.hours
        const minutes = this.postForm.minutes
        const seconds = this.postForm.seconds
        this.makeTime = hours + '-' + minutes + '-' + seconds
        for (let index = 0; index < this.tempSteps.length; index++) {
          const element = this.tempSteps[index]
          const hour = parseInt(element.duration / 3600)
          const minute = parseInt(element.duration % 3600 / 60)
          const second = element.duration % 3600 % 60
          element.duration = hour + '-' + minute + '-' + second
        }
      })
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      // fetchArticle(id).then(response => {
      //   this.postForm = response.data
      //   // just for test
      //   this.postForm.title += `   Article Id:${this.postForm.id}`
      //   this.postForm.content_short += `   Article Id:${this.postForm.id}`
      //   // set tagsview title
      //   this.setTagsViewTitle()
      //   // set page title
      //   this.setPageTitle()
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    tagsObj2Ids(arr) {
      const idsArr = []
      for (let index = 0; index < arr.length; index++) {
        const el = arr[index]
        idsArr.push(el.tagId)
      }
      return idsArr
    },
    getVideoList(arr) {
      const idsArr = []
      for (let index = 0; index < arr.length; index++) {
        const tmpArr = { 'name': arr[index] }
        idsArr.push(tmpArr)
      }
      return idsArr
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          if (this.makeTime) {
            const makeTimeArr = this.makeTime.split('-')
            this.postForm.hours = parseInt(makeTimeArr[0])
            this.postForm.minutes = parseInt(makeTimeArr[1])
            this.postForm.seconds = parseInt(makeTimeArr[2])
          }

          const tempSteps = []
          for (let index = 0; index < this.tempSteps.length; index++) {
            const element = Object.assign({}, this.tempSteps[index])
            if (element.duration) {
              const durTimeArr = element.duration.split('-')
              element.duration = parseInt(durTimeArr[0]) * 60 * 60 + parseInt(durTimeArr[1]) * 60 + parseInt(durTimeArr[2])
            }
            tempSteps.push(element)
          }

          this.postForm.step = tempSteps

          // tags赋值
          // debugger
          if (this.isEdit) {
            if (this.postForm.season && this.tagsObj2Ids(this.postForm.season).toString() == this.seasonArr.toString()) {
              this.postForm.season = ''
            } else {
              this.postForm.season = this.seasonArr
            }

            if (this.postForm.festival && this.tagsObj2Ids(this.postForm.festival).toString() == this.festivalArr.toString()
            ) {
              this.postForm.festival = ''
            } else {
              this.postForm.festival = this.festivalArr
            }

            if (this.postForm.suitablePeople && this.tagsObj2Ids(this.postForm.suitablePeople).toString() == this.goodPeopleArr.toString()) {
              this.postForm.suitablePeople = ''
            } else {
              this.postForm.suitablePeople = this.goodPeopleArr
            }

            if (this.postForm.improperPeople && this.tagsObj2Ids(this.postForm.improperPeople).toString() == this.badPeopleArr.toString()) {
              this.postForm.improperPeople = ''
            } else {
              this.postForm.improperPeople = this.badPeopleArr
            }

            if (this.postForm.suitablePhysiology && this.tagsObj2Ids(this.postForm.suitablePhysiology).toString() == this.goodPhysioArr.toString()
            ) {
              this.postForm.suitablePhysiology = ''
            } else {
              this.postForm.suitablePhysiology = this.goodPhysioArr
            }

            if (this.postForm.improperPhysiology && this.tagsObj2Ids(this.postForm.improperPhysiology).toString() == this.badPhysioArr.toString()
            ) {
              this.postForm.improperPhysiology = ''
            } else {
              this.postForm.improperPhysiology = this.badPhysioArr
            }

            if (this.postForm.suitableSick && this.tagsObj2Ids(this.postForm.suitableSick).toString() == this.goodSickArr.toString()) {
              this.postForm.suitableSick = ''
            } else {
              this.postForm.suitableSick = this.goodSickArr
            }

            if (this.postForm.improperSick && this.tagsObj2Ids(this.postForm.improperSick).toString() == this.badSickArr.toString()
            ) {
              this.postForm.improperSick = ''
            } else {
              this.postForm.improperSick = this.badSickArr
            }

            if (this.postForm.effect && this.tagsObj2Ids(this.postForm.effect).toString() == this.functionArr.toString()
            ) {
              this.postForm.effect = ''
            } else {
              this.postForm.effect = this.functionArr
            }

            if (this.postForm.taste && this.tagsObj2Ids(this.postForm.taste).toString() == this.tasteArr.toString()) {
              this.postForm.taste = ''
            } else {
              this.postForm.taste = this.tasteArr
            }

            if (this.postForm.dishStyle && this.tagsObj2Ids(this.postForm.dishStyle).toString() == this.dishStyleArr.toString()) {
              this.postForm.dishStyle = ''
            } else {
              this.postForm.dishStyle = this.dishStyleArr
            }

            if (this.postForm.cookStyle && this.tagsObj2Ids(this.postForm.cookStyle).toString() == this.cookStyleArr.toString()) {
              this.postForm.cookStyle = ''
            } else {
              this.postForm.cookStyle = this.cookStyleArr
            }

            if (this.postForm.device && this.tagsObj2Ids(this.postForm.device).toString() == this.deviceArr.toString()) {
              this.postForm.device = ''
            } else {
              this.postForm.device = this.deviceArr
            }

            if (this.postForm.category && this.postForm.category.toString() == this.recipesCGArr.toString()) {
              this.postForm.category = ''
            } else {
              this.postForm.category = this.recipesCGArr
            }

            // 烹饪方式
            if (this.postForm.cookPattern && this.postForm.cookPattern.toString() == this.cookPatternArr.toString()) {
              this.postForm.cookPattern = ''
            } else {
              this.postForm.cookPattern = this.cookPatternArr
            }

            // 职业
            if (this.postForm.occupation && this.postForm.occupation.toString() == this.occupationArr.toString()) {
              this.postForm.occupation = ''
            } else {
              this.postForm.occupation = this.occupationArr
            }

            // 视频地址
            const tmpVideoArr = this.uploadVideoList.map(function(v) { return v.name })
            // let tmpVideoArr =
            if (this.postForm.videoUrl && this.postForm.videoUrl.toString() == tmpVideoArr.toString()) {
              this.postForm.videoUrl = ''
            } else {
              this.postForm.videoUrl = tmpVideoArr
            }

            this.postForm.step = this.tempSteps
          } else {
            this.postForm.id = '0'
            this.postForm.season = this.seasonArr
            this.postForm.festival = this.festivalArr
            this.postForm.suitablePeople = this.goodPeopleArr
            this.postForm.improperPeople = this.badPeopleArr
            this.postForm.suitablePhysiology = this.goodPhysioArr
            this.postForm.improperPhysiology = this.badPhysioArr
            this.postForm.suitableSick = this.goodSickArr
            this.postForm.improperSick = this.badSickArr
            this.postForm.effect = this.functionArr
            this.postForm.taste = this.tasteArr
            this.postForm.dishStyle = this.dishStyleArr
            this.postForm.cookStyle = this.cookStyleArr
            this.postForm.device = this.deviceArr
            this.postForm.category = this.recipesCGArr
            this.postForm.step = this.tempSteps
            this.postForm.cookPattern = this.cookPatternArr
            this.postForm.occupation = this.occupationArr
            this.postForm.videoUrl = this.uploadVideoList.map(function(v) { return v.name })
          }

          createRecipe(this.postForm, this.isEdit).then(res => {
            this.$router.go(-1) // 返回上一层
            this.$notify({
              title: '成功',
              message: '已成功保存',
              type: 'success',
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
          this.$router.go(-1) // 返回上一层
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },

    /**
       * @description: 上传成功
       */
    uploadImgSuccess(response, file, fileList) {
      if (fileList.length > 0 && response.code == 200) {
        this.postForm.image = response.data.all_img_url
        // 移除必填的提醒
        this.$refs['uploadFormItem'].clearValidate()
      } else {
        this.$message('上传失败')
        this.uploadImgList = []
        this.postForm.image = ''
      }
    },
    uploadStepImgSuccess(response, file, fileList, index) {
      console.log(response)
      if (fileList.length > 0) {
        this.tempSteps[index].stepImage = response.data.all_img_url
      } else {
        this.tempSteps[index].stepImage = ''
      }
    },
    /**
       * @description: 删除已上传图片
       */
    uploadImgRemove(file, fileList) {
      this.postForm.image = ''
    },
    uploadStepImgRemove(file, fileList, index) {
      this.tempSteps[index].stepImage = ''
    },
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
      // video删除对应视频地址
      // let idsArr = []
      for (let index = 0; index < this.uploadVideoList.length; index++) {
        if (this.uploadVideoList[index].name == file.name) {
          this.uploadVideoList.splice(index, 1)
          // console.log(this.uploadVideoList)
        }
      }
    },
    beforeRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
    },
    uploadFileSuccess(response, file, fileList) {
      if (fileList.length > 0 && response.code == 200) {
        file.name = file.response.data.all_img_url
        this.uploadVideoList.push({ 'name': file.name })
        // this.postForm.videoUrl += ","+ response.data.all_img_url;

        console.log(fileList)
        console.log(file)
        console.log(response)
        console.log(this.uploadVideoList)
        // 移除必填的提醒
        this.$refs['uploadFormItem'].clearValidate()
      } else {
        this.$message('上传失败')
        console.log(fileList)
        console.log(file)
        console.log(this.uploadVideoList)
        for (let index = 0; index < fileList.length; index++) {
          // eslint-disable-next-line eqeqeq
          if (fileList[index].uid == file.uid) {
            fileList.splice(index, 1)
          }
        }

        // this.uploadVideoList.push({'name':file.name})
        // this.uploadImgList = [];
        // this.postForm.image = "";
      }
    },
    handleExceed(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    /**
       * @description: 上传图片预览
       * @param file
       */
    handleUploadImgPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImgPreviewVisible = true
    },
    uploadExceed(files, fileList) {
      this.$message.error('图片只能上传一张，请先删除再上传！')
    },
    handleTabClick() {
    },
    handleCreateStep() {
      let cookId = null
      if (this.$route.params && this.$route.params.id) {
        cookId = this.$route.params.id
      }
      this.tempSteps.push({
        cookId: cookId,
        stepDesc: null,
        stepImage: null,
        type: 0, // 烹饪类型
        position: null, // 放入位置
        duration: null, // 烹饪时长
        fermentType: null, // 发酵类型
        temperature: null // 温度调节
      })
    },
    /**
       * @description: 删除功效信息
       * @param row
       */
    delStep(index) {
      this.$confirm('确定删除该步骤?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.tempSteps.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    cookStepChange(item) {
      if (item.type == 0) {
        item.position = null
        item.duration = null
        item.temperature = null
        item.fermentType = null
      } else if (item.type == 2) {
        item.position = 1
        item.duration = null
        item.temperature = null
        item.fermentType = null
      } else {
        item.position = null
        item.duration = null
        item.temperature = null
        item.fermentType = null
      }
    }
  }
}
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

  .step-cell {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .step-cell-hd {

  }

  .cell-img-con {
    padding-top: 5px;
  }

  .step-cell-text {
    flex: 1;
    margin: 0 20px;
  }

  .step-cell-ft {
    img {
      width: 30px;
      cursor: pointer;
    }
  }
  .sels-con {
    width: 740px;
    display: flex;
    flex-wrap: wrap;
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

  .step-cell {
    .el-upload--picture-card {
      width: 80px;
      height: 80px;
    }

    .el-upload--picture-card i {
      vertical-align: middle;
      margin-top: -68px;
    }

    .el-upload-list--picture-card .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
  }
</style>
