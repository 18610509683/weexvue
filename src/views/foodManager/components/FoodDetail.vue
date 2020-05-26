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
            <el-form-item
              style="margin-bottom: 40px;min-height: 148px;"
              label-width="100px"
              label="食材图片"
              prop="image"
              ref="uploadFormItem"
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
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="100px"
                    label="来源:"
                    class="postInfo-container-item"
                    prop="source"
                  >
                    <el-select v-model="postForm.source" placeholder="请选择来源">
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
                  <el-form-item
                    label-width="100px"
                    label="食材分类:"
                    class="postInfo-container-item"
                    prop="food_type"
                  >
                    <el-select v-model="postForm.food_type" placeholder="请选择食材分类">
                      <el-option
                        v-for="(item,index) in foodCGOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="100px"
                    label="食材ID:"
                    class="postInfo-container-item"
                    prop="id"
                    v-if="postForm.id"
                  >
                    <el-input placeholder="食材ID" v-model="postForm.id" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label-width="100px" label="存储建议:" class="postInfo-container-item">
                    <el-checkbox-group v-model="storeTypeCheckList">
                      <el-checkbox label="refrig">冷藏室</el-checkbox>
                      <el-input style="width:130px;margin-right:25px;" placeholder="请输入天数" v-model="refrigTime">
                        <template slot="append">天</template>
                      </el-input>
                      <el-checkbox label="freeze">冷冻室</el-checkbox>
                      <el-input style="width:130px;" placeholder="请输入天数" v-model="freezeTime">
                        <template slot="append">天</template>
                      </el-input>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 20px;" label-width="100px" label="食材别名:">
          <el-input
            v-model="postForm.food_alias"
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
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.cook_tips"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">清洗与刀工:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.clean_knife"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">选购要诀:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.buy_tips"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">保存方法:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.save_method"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="营养功效" name="baike2">
              <el-col :span="24">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">营养成分:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.nutrition"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">养生功效:</div>
                  </slot>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="postForm.health"></el-input>
                </el-form-item>
              </el-col>
            </el-tab-pane>
            <el-tab-pane label="饮食宜忌" name="baike3">
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">适宜人群:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.suitable_people"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">适宜搭配:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.suitable_food"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">不宜人群:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.improper_people"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="baikeTextarea">
                  <slot name="label">
                    <div class="form-item-title">禁忌搭配:</div>
                  </slot>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="postForm.improper_food"
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
        :rules="colloctRules"
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
  food_type: null, //食材分类
  source: null, //食材来源（1 掌厨 2 运营编辑）

  store_advice: "", //存储建议
  food_alias: "", //食材别名
  cook_tips: "", //烹饪指南
  clean_knife: "", //清洁与刀工
  buy_tips: "", //购买技巧
  save_method: "", //保存方法
  nutrition: "", //营养成分
  health: "", //养生功效
  suitable_people: "", //适应人群
  improper_people: "", //不宜人群
  suitable_food: "", //饮食适应搭配
  improper_food: "", //饮食不宜搭配
  suitable: "", //食材适应搭配（JSON字符串）
  improper: "", //食材不宜搭配 （JSON字符串）

  season: null,
  festival: null,
  suitable_people_arr: null,
  improper_people_arr: null,
  suitable_physiology: null,
  improper_physiology: null,
  suitable_sick: null,
  improper_sick: null,
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
        food_type: [
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
      colloctRules: {
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
        {
          name: "掌厨",
          value: 1
        },
        {
          name: "运营编辑",
          value: 2
        }
      ],
      foodCGOptions: [], //食品分类

      goodCollocts: [],
      badCollocts: [],
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
    //获取季节数据
    fetchAllTag({ type_id: 1 }).then(res => {
      this.seasonOptions = res.data;
    });
    //获取节日数据
    fetchAllTag({ type_id: 2 }).then(res => {
      this.festivalOptions = res.data;
    });
    //获取适应人群数据
    fetchAllTag({ type_id: 3 }).then(res => {
      this.peopleOptions = res.data;
    });
    //获取适应人群数据
    fetchAllTag({ type_id: 4 }).then(res => {
      this.physiologyOptions = res.data;
    });
    //获取适应人群数据
    fetchAllTag({ type_id: 6 }).then(res => {
      this.sickOptions = res.data;
    });
    //获取适应人群数据
    fetchAllTag({ type_id: 5 }).then(res => {
      this.functionOptions = res.data;
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
        
        this.storeTypeCheckList = []
        for (let index = 0; index < this.postForm.store_advice.length; index++) {
          const el = this.postForm.store_advice[index];
          let key = Object.keys(this.postForm.store_advice[index])[0]
          if (key == 'refrig') {
            this.refrigTime = el.refrig
          }else if(key == 'freeze'){
            this.freezeTime = el.freeze
          }
          this.storeTypeCheckList.push(key)
        }

        //tags反赋值
        this.seasonArr = this.postForm.season;
        this.festivalArr = this.postForm.festival;
        this.goodPeopleArr = this.postForm.suitable_people_arr;
        this.badPeopleArr = this.postForm.improper_people_arr;
        this.goodPhysioArr = this.postForm.suitable_physiology;
        this.badPhysioArr = this.postForm.improper_physiology;
        this.goodSickArr = this.postForm.suitable_sick;
        this.badSickArr = this.postForm.improper_sick;
        this.functionArr = this.postForm.effect;

        if (this.postForm.suitable) {
          this.goodCollocts = this.postForm.suitable
        }
        
        if (this.postForm.improper) {
          this.badCollocts = this.postForm.improper
        }
        

        if (this.postForm.image && this.postForm.image.length > 0) {
          this.uploadImgList = [{ url: this.postForm.image }];
        } else {
          this.uploadImgList = [];
        }
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
          let store_advice = []
          for (let index = 0; index < this.storeTypeCheckList.length; index++) {
            const el = this.storeTypeCheckList[index];
            if (el == 'refrig') {
              store_advice.push({refrig:this.refrigTime})
            }else if(el == 'freeze'){
              store_advice.push({freeze:this.freezeTime})
            }
          }

          this.postForm.store_advice = store_advice
          // this.postForm.store_advice = [{ [this.storeType]: this.storeTime }]; 变量当key
          
          //tags赋值
          if (this.isEdit) {
            if (this.postForm.season&&(this.postForm.season == this.seasonArr)) {
              this.postForm.season = ''
            }else{
              this.postForm.season = this.seasonArr;
            }

            if (this.postForm.festival&&(this.postForm.festival == this.festivalArr)) {
              this.postForm.festival = ''
            }else{
              this.postForm.festival = this.festivalArr;
            }

            if (this.postForm.suitable_people_arr&&(this.postForm.suitable_people_arr == this.goodPeopleArr)) {
              this.postForm.suitable_people_arr = ''
            }else{
              this.postForm.suitable_people_arr = this.goodPeopleArr;
            }

            if (this.postForm.improper_people_arr&&(this.postForm.improper_people_arr == this.badPeopleArr)) {
              this.postForm.improper_people_arr = ''
            }else{
              this.postForm.improper_people_arr = this.badPeopleArr;
            }

            if (this.postForm.suitable_physiology&&(this.postForm.suitable_physiology == this.goodPhysioArr)) {
              this.postForm.suitable_physiology = ''
            }else{
              this.postForm.suitable_physiology = this.goodPhysioArr;
            }

            if (this.postForm.improper_physiology&&(this.postForm.improper_physiology == this.badPhysioArr)) {
              this.postForm.improper_physiology = ''
            }else{
              this.postForm.improper_physiology = this.badPhysioArr;
            }

            if (this.postForm.suitable_sick&&(this.postForm.suitable_sick == this.goodSickArr)) {
              this.postForm.suitable_sick = ''
            }else{
              this.postForm.suitable_sick = this.goodSickArr;
            }

            if (this.postForm.improper_sick&&(this.postForm.improper_sick == this.badSickArr)) {
              this.postForm.improper_sick = ''
            }else{
              this.postForm.improper_sick = this.badSickArr;
            }

            if (this.postForm.effect&&(this.postForm.effect == this.functionArr)) {
              this.postForm.effect = ''
            }else{
              this.postForm.effect = this.functionArr;
            }

          }else{
            this.postForm.season = this.seasonArr;
            this.postForm.festival = this.festivalArr;
            this.postForm.suitable_people_arr = this.goodPeopleArr;
            this.postForm.improper_people_arr = this.badPeopleArr;
            this.postForm.suitable_physiology = this.goodPhysioArr;
            this.postForm.improper_physiology = this.badPhysioArr;
            this.postForm.suitable_sick = this.goodSickArr;
            this.postForm.improper_sick = this.badSickArr;
            this.postForm.effect = this.functionArr;
          }

          this.postForm.suitable = this.goodCollocts;
          this.postForm.improper = this.badCollocts;

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
      console.log(response);
      if (fileList.length > 0) {
        this.postForm.image = response.data.all_img_url;
        //移除必填的提醒
        this.$refs["uploadFormItem"].clearValidate();
      } else {
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
          if (this.isGood) {
            this.goodCollocts.push(tempData);
          } else {
            this.badCollocts.push(tempData);
          }
          this.dialogCollectVisible = false;
          this.$message({
            type: "success",
            message: "已成功创建!"
          });
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
          this.dialogCollectVisible = false;
          this.$message({
            type: "success",
            message: "更新成功!"
          });
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
