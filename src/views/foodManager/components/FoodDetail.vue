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
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput v-model="postForm.name" :maxlength="100" name="name">食材名称</MDinput>
            </el-form-item>
            <el-form-item style="margin-bottom: 40px;min-height: 148px;" label-width="100px" label="食材图片" prop="image" ref="uploadFormItem">
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
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="来源:" class="postInfo-container-item" prop="source" >
                    <el-select v-model="postForm.source" placeholder="请选择来源">
                      <el-option  v-for="(item,index) in sourceOptions" :key="index" :label="item.name" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="食材分类:" class="postInfo-container-item" prop="categoryId">
                    <el-select v-model="postForm.categoryId" placeholder="请选择食材分类">
                      <el-option v-for="(item,index) in foodCGOptions" :key="index" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="100px" label="食材ID:" class="postInfo-container-item" prop="id" v-if="postForm.id">
                    <el-input placeholder="食材ID" v-model="postForm.id" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="250px" label="冷藏室存储天数建议:" class="postInfo-container-item">
                    <el-input placeholder="冷藏天数" v-model="postForm.coldStoreDay" >
                      <template slot="append">天</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="250px" label="冷冻室存储天数建议:" class="postInfo-container-item">
                    <el-input placeholder="冷冻天数" v-model="postForm.freezeStoreDay" >
                      <template slot="append">天</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="食材别名:">
          <el-input
            v-model="postForm.aliasName"
            :rows="1"
            type="textarea"
            class="article-textarea"
            style="height: 40px;"
            autosize
            placeholder="请输入食材别名（可以输入多个别名，中间用逗号间隔）"
          />
        </el-form-item>
      </div>
      <div class="divider">食材标签</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px;">
          <el-col :span="12">
            <el-form-item label-width="120px" label="时令:">
              <el-select v-model="seasonArr" multiple filterable placeholder="请选择时令">
                <el-option
                  v-for="item in seasonOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="节日:">
              <el-select v-model="festivalArr" multiple filterable placeholder="请选择节日">
                <el-option
                  v-for="item in festivalOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="适宜人群:">
              <el-select v-model="goodPeopleArr" multiple filterable placeholder="请选择适宜人群">
                <el-option
                  v-for="item in peopleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="禁忌人群:">
              <el-select v-model="badPeopleArr" multiple filterable placeholder="请选择禁忌人群">
                <el-option
                  v-for="item in peopleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="适宜生理阶段:">
              <el-select v-model="goodPhysioArr" multiple filterable placeholder="请选择适宜生理阶段">
                <el-option
                  v-for="item in physiologyOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="禁忌生理阶段:">
              <el-select v-model="badPhysioArr" multiple filterable placeholder="请选择禁忌生理阶段">
                <el-option
                  v-for="item in physiologyOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="适宜疾病:">
              <el-select v-model="goodSickArr" multiple filterable placeholder="请选择适宜疾病">
                <el-option
                  v-for="item in sickOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="禁忌疾病:">
              <el-select v-model="badSickArr" multiple filterable placeholder="禁忌疾病">
                <el-option
                  v-for="item in sickOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="120px" label="功效:">
              <el-select v-model="functionArr" multiple filterable placeholder="请选择功效">
                <el-option
                  v-for="item in functionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="divider">食材百科</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px;">
          <el-tabs v-model="baikeActiveVal" @tab-click="handleTabClick">
            <el-tab-pane label="实用百科" name="baike1">
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">烹饪指南:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.cookTipsDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">清洗与刀工:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.cleanKnifeDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">选购要诀:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.buyTipsDesc" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">保存方法:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.saveMethodDesc"></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="营养功效" name="baike2">
              <el-col :span="24">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">营养成分:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.nutritionDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">养生功效:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.healthDesc"></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="饮食宜忌" name="baike3">
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">适宜人群:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.suitablePeopleDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">适宜搭配:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.suitableFoodDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">不宜人群:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.improperPeopleDesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">禁忌搭配:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容"
                    v-model="postForm.improperFoodDesc"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
      <div class="divider">食材搭配</div>
      <div class="createPost-main-container">
        <el-row style="margin-top: 25px;">
          <el-col :span="24">
            <el-form-item>
              <slot name="label">
                <div class="colloct-header">
                  <div class="form-item-title colloct-title">适宜搭配:</div>
                  <el-button
                    class="colloct-add"
                    type="primary"
                    size="mini"
                    @click="handleCreateColl(true)"
                  >新增</el-button>
                </div>
              </slot>
              <el-table :data="goodCollocts" border style="width: 100%;margin-top: 20px;">
                <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
                <el-table-column label="食材名称" prop="name" align="center"></el-table-column>
                <el-table-column label="功效" prop="function" align="center"></el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleUpdateColl(scope.row,true,scope.$index)"
                    >编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelColl(scope.row,true)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <slot name="label">
                <div class="colloct-header">
                  <div class="form-item-title colloct-title">禁忌搭配:</div>
                  <el-button
                    class="colloct-add"
                    type="primary"
                    size="mini"
                    @click="handleCreateColl(false)"
                  >新增</el-button>
                </div>
              </slot>
              <el-table :data="badCollocts" border style="width: 100%;margin-top: 20px;">
                <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
                <el-table-column label="食材名称" prop="name" align="center"></el-table-column>
                <el-table-column label="功效" prop="function" align="center"></el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleUpdateColl(scope.row,false,scope.$index)"
                    >编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDelColl(scope.row,false)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogImgPreviewVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <el-dialog
      custom-class="p-dialog"
      :title="collectTextMap[dialogStatus]"
      :visible.sync="dialogCollectVisible"
    >
      <el-form
        ref="colloctForm"
        :rules="subRules"
        :model="colloctTemp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="食材名称" prop="name">
          <el-autocomplete
            v-model="colloctTemp.name"
            :fetch-suggestions="fetchAllFood"
            placeholder="请输入食材名称或别名进行搜索"
            @select="handleSelect"
            style="width: 300px;"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="食材ID" prop="id">
          <el-input v-model="colloctTemp.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="搭配功效" prop="function">
          <el-input v-model="colloctTemp.function" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCollectVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createCollect():updateCollect()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchAllFood,
  createFood,
  fetchFoodDetail,
  fetchAllTag,
  fetchAllFoodType
} from "@/api/foodManager.js";
import MDinput from "@/components/MDinput";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { validURL } from "@/utils/validate";
// import { fetchArticle } from '@/api/article'
// import { searchUser } from '@/api/remote-search'
import { getToken } from "@/utils/auth";

const defaultForm = {
  id: null, //食材id
  name: "", //食材名称
  image: null, //食材图片
  categoryId: null, //食材分类
  source: null, //食材来源（1 掌厨 2 运营编辑）

  aliasName: "", //食材别名
  cookTipsDesc: "", //烹饪指南
  cleanKnifeDesc: "", //清洁与刀工
  buyTipsDesc: "", //购买技巧
  saveMethodDesc: "", //保存方法
  nutritionDesc: "", //营养成分
  healthDesc: "", //养生功效
  suitablePeopleDesc: "",//适宜人群
  improperPeopleDesc: "",//禁忌人群
  suitableFoodDesc: "", // 适宜搭配
  improperFoodDesc: "", // 禁忌搭配
  suitablePeople: "", //适应人群
  improperPeople: "", //不宜人群
  suitableFood: "", //饮食适应搭配
  improperFood: "", //饮食不宜搭配
  suitable: "", //食材适应搭配（JSON字符串）
  improper: "", //食材不宜搭配 （JSON字符串）
  freezeStoreDay: "", //冷藏室建议存储天数
  coldStoreDay: "", //冷冻室建议存储天数
  season: null,
  festival: null,
  suitablePeopleArr: null, //适宜人群
  improperPeopleArr: null,//禁忌人群
  suitablePhysiology: null,
  improperPhysiology: null,
  suitableSick: null,
  improperSick: null,
  effect: null
};

export default {
  name: "FoodDetail",
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageStatus: "draft",
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        name: [{ required: true, message: "请输入食材名称", trigger: "blur" }],
        id: [{ required: true, message: "食材ID", trigger: "blur" }],
        source: [
          { required: true, message: "请选择食材来源", trigger: "change" }
        ],
        categoryId: [
          { required: true, message: "请选择食材分类", trigger: "change" }
        ],
        image: [{ required: true, message: "请上传食材图片" }]
      },

      storeTypeCheckList: [], //存储方式列表 refrig 冷藏 freeze 冷藏
      refrigTime: null, //存储时间 int day
      freezeTime: null,

      isGood: true, // 是否是好的搭配
      collectIndex: null, //搭配列表索引
      colloctTemp: {
        id: null,
        name: "",
        function: ""
      },

      dialogStatus: "",
      collectTextMap: {
        update: "编辑",
        create: "新增"
      },
      subRules: {
        name: [{ required: true, message: "请选择食材", trigger: "change" }],
        id: [{ required: true, message: "食材ID", trigger: "blur" }],
        function: [{ required: true, message: "请输入功效", trigger: "blur" }]
      },
      dialogCollectVisible: false,

      tempRoute: {},
      dialogImageUrl: "",
      dialogImgPreviewVisible: false,

      uploadImgList: [],

      sourceOptions: [
        { value: 1, name: 'IOT' }, { value: 2, name: '掌厨' }, { value: 3, name: '运营编辑' }
      ],
      foodCGOptions: [], //食品分类

      goodCollocts: [], //食材适宜单配
      badCollocts: [], //食材禁忌搭配
      seasonArr: [],
      festivalArr: [],
      goodPeopleArr: [],
      badPeopleArr: [],
      goodPhysioArr: [],
      badPhysioArr: [],
      goodSickArr: [],
      badSickArr: [],
      functionArr: [],
      seasonOptions: [],
      festivalOptions: [],
      peopleOptions: [],
      physiologyOptions: [], //生理阶段
      sickOptions: [], //疾病
      functionOptions: [], //功效

      baikeActiveVal: "baike1",

      foodDetail: null
    };
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length;
    },
    uploadParam() {
      let param = {
        token: getToken()
      };
      return param;
    }
  },
  created() {
    //获得标签数据
    fetchAllTag().then(res => {
      //获取时令季节数据
      this.seasonOptions = res.data[1];
      //获取节日数据
      this.festivalOptions = res.data[2];
      //获取适应人群数据
      this.peopleOptions = res.data[3];
      //获取生理阶段数据
      this.physiologyOptions = res.data[4];
      //获取功效数据
      this.functionOptions = res.data[5];
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

    //获取所有食品分类
    fetchAllFoodType().then(res => {
      this.foodCGOptions = res.data;
    });

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      fetchFoodDetail({ id }).then(res => {
        let data = res.data;
        Object.keys(this.postForm).forEach(key => {
          this.postForm[key] = data[key];
        });

        //tags反赋值
        this.seasonArr = this.postForm.season;
        this.festivalArr = this.postForm.festival;
        this.goodPeopleArr = this.postForm.suitablePeople;
        this.badPeopleArr = this.postForm.improperPeople;
        this.goodPhysioArr = this.postForm.suitablePhysiology;
        this.badPhysioArr = this.postForm.improperPhysiology;
        this.goodSickArr = this.postForm.suitableSick.concat();
        this.badSickArr = this.postForm.improperSick;
        this.functionArr = this.postForm.effect;

        //搭配食材
        this.goodCollocts = this.postForm.suitableFood.concat()
        //禁忌食材
        this.badCollocts = this.postForm.improperFood.concat()
        //搭配食材
        // if (this.postForm.suitableFood) {
        //   this.goodCollocts = this.postForm.suitableFood.concat()
        // }

        //禁忌食材
        // if (this.postForm.improperFood) {
        //   this.badCollocts = this.postForm.improperFood.concat()
        // }

        if (this.postForm.image && this.postForm.image.length > 0) {
          this.uploadImgList = [{ url: this.postForm.image }];
        } else {
          this.uploadImgList = [];
        }
        // console.log(this.postForm)
      });
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);
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
    setTagsViewTitle() {
      const title = "Edit Article";
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      });
      this.$store.dispatch("tagsView/updateVisitedView", route);
    },
    setPageTitle() {
      const title = "Edit Article";
      document.title = `${title} - ${this.postForm.id}`;
    },
    submitForm() {
      this.$refs["postForm"].validate(valid => {
        if (valid) {
          // let store_advice = []
          // for (let index = 0; index < this.storeTypeCheckList.length; index++) {
          //   const el = this.storeTypeCheckList[index];
          //   if (el == 'refrig') {
          //     store_advice.push({refrig:this.refrigTime})
          //   }else if(el == 'freeze'){
          //     store_advice.push({freeze:this.freezeTime})
          //   }
          // }

          // this.postForm.store_advice = store_advice
          // this.postForm.store_advice = [{ [this.storeType]: this.storeTime }]; 变量当key
          // console.log(this.postForm)
          //tags赋值

          if (this.isEdit) {
            if (this.postForm.season && (this.postForm.season == this.seasonArr)) {
              this.postForm.season = ''
            }else{
              this.postForm.season = this.seasonArr;
            }

            if (this.postForm.festival && (this.postForm.festival == this.festivalArr)) {
              this.postForm.festival = ''
            }else{
              this.postForm.festival = this.festivalArr;
            }
            // debugger
            // console.log(this.postForm.suitablePeople)
            // console.log(this.goodPeopleArr)
            if (this.postForm.suitablePeople && (this.postForm.suitablePeople == this.goodPeopleArr)) {
              this.postForm.suitablePeople = ''
              // debugger
            }else{
              this.postForm.suitablePeople = this.goodPeopleArr;
            }

            if (this.postForm.improperPeople && (this.postForm.improperPeople == this.badPeopleArr)) {
              this.postForm.improperPeople = ''
            }else{
              this.postForm.improperPeople = this.badPeopleArr;
            }

            if (this.postForm.suitablePhysiology && (this.postForm.suitablePhysiology == this.goodPhysioArr)) {
              this.postForm.suitablePhysiology = ''
            }else{
              this.postForm.suitablePhysiology = this.goodPhysioArr;
            }

            if (this.postForm.improperPhysiology && (this.postForm.improperPhysiology == this.badPhysioArr)) {
              this.postForm.improperPhysiology = ''
            }else{
              this.postForm.improperPhysiology = this.badPhysioArr;
            }

            if (this.postForm.suitableSick && (this.postForm.suitableSick == this.goodSickArr)) {
              this.postForm.suitableSick = ''
            }else{
              this.postForm.suitableSick = this.goodSickArr;
            }

            if (this.postForm.improperSick && (this.postForm.improperSick == this.badSickArr)) {
              this.postForm.improperSick = ''
            }else{
              this.postForm.improperSick = this.badSickArr;
            }

            if (this.postForm.effect && (this.postForm.effect == this.functionArr)) {
              this.postForm.effect = ''
            }else{
              this.postForm.effect = this.functionArr;
            }


            //食材搭配
            if (this.postForm.suitableFood && (this.postForm.suitableFood == this.goodCollocts)) {
              this.postForm.suitableFood = ''
            }else{
              this.postForm.suitableFood = this.goodCollocts;
            }
            //禁忌搭配
            if (this.postForm.improperFood && (this.postForm.suitableFood == this.badCollocts)) {
              this.postForm.improperFood = ''
            }else{
              this.postForm.improperFood = this.badCollocts;
            }
          }else{
            this.postForm.season = this.seasonArr;
            this.postForm.festival = this.festivalArr;
            this.postForm.suitablePeopleArr = this.goodPeopleArr;
            this.postForm.suitablePeopleArr = this.badPeopleArr;
            this.postForm.suitablePhysiology = this.goodPhysioArr;
            this.postForm.improperPhysiology = this.badPhysioArr;
            this.postForm.suitableSick = this.goodSickArr;
            this.postForm.improperSick = this.badSickArr;
            this.postForm.effect = this.functionArr;

            this.postForm.suitableFood = this.goodCollocts;
            this.postForm.improperFood = this.badCollocts;
          }

          createFood(this.postForm,this.isEdit).then(res => {
            this.$router.go(-1); //返回上一层
            this.$notify({
              title: "成功",
              message: "已成功保存",
              type: "success",
              duration: 1000
            });
          });
        }
      });
    },
    goback() {
      this.$confirm("退出页面不会保存已编辑内容, 是否继续退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
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
      if (fileList.length > 0 && response.code==200) {
        this.postForm.image = response.data.all_img_url;
        //移除必填的提醒
        this.$refs["uploadFormItem"].clearValidate();
      } else {
        this.$message('上传失败');
        this.uploadImgList = [];
        this.postForm.image = "";
      }
    },
    /**
     * @description: 删除已上传图片
     */
    uploadImgRemove(file, fileList) {
      this.postForm.image = "";
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
    handleTabClick() {},

    fetchAllFood(queryString, cb) {
      fetchAllFood({
        name: queryString
      }).then(res => {
        let data = res.data;
        for (let index = 0; index < data.length; index++) {
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
        id: null,
        name: "",
        function: ""
      };
    },
    createCollect() {
      this.$refs["colloctForm"].validate(valid => {
        if (valid) {
          let tempData = Object.assign({}, this.colloctTemp);
          console.log(tempData)
          if (this.isGood) {
            this.goodCollocts.push(tempData);
          } else {
            this.badCollocts.push(tempData);
          }

          console.log('xx')
          console.log(this.postForm.suitableFood)
          console.log(this.goodCollocts)
          console.log('xx')
          this.dialogCollectVisible = false;
          this.$message({
            type: "success",
            message: "已成功创建!"
          });
          // console.log(1);
          // console.log(this.goodCollocts);
          // console.log(2);
        }
      });
    },
    updateCollect() {
      this.$refs["colloctForm"].validate(valid => {
        if (valid) {
          let tempData = Object.assign({}, this.colloctTemp);
          if (this.isGood) {
            this.goodCollocts.splice(this.collectIndex, 1, tempData);
          } else {
            this.badCollocts.splice(this.collectIndex, 1, tempData);
          }
          console.log('yy')
          console.log(this.postForm.suitableFood)
          console.log(this.goodCollocts)
          console.log('yy')
          this.dialogCollectVisible = false;
          this.$message({
            type: "success",
            message: "更新成功!"
          });
          // console.log(this.goodCollocts);

        }
      });
    },
    handleCreateColl(isGood) {
      this.isGood = isGood;
      this.resetCollectTemp();
      this.dialogStatus = "create";
      this.dialogCollectVisible = true;
      this.$nextTick(() => {
        this.$refs["colloctForm"].clearValidate();
      });
    },
    handleUpdateColl(row, isGood, index) {
      this.isGood = isGood;
      this.collectIndex = index;
      this.colloctTemp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogCollectVisible = true;
      this.$nextTick(() => {
        this.$refs["colloctForm"].clearValidate();
      });
    },
    /**
     * @description: 删除功效信息
     * @param row
     */
    handleDelColl(row, isGood) {
      this.isGood = isGood;
      this.$confirm("确定删除该功效?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log('x')
          console.log(this.postForm.suitableFood)
          console.log(this.goodCollocts)
          console.log('x')
          let list = null;
          if (this.isGood) {
            list = this.goodCollocts;
          } else {
            list = this.badCollocts;
          }
          for (const v of list) {
            if (v.id === row.id) {
              const index = list.indexOf(v);
              list.splice(index, 1);
              break;
            }
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
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
</style>
