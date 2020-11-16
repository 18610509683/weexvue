<!--
 * @Description: 垃圾信息管理页面
 -->
 
<template>
  <div class="app-container garbage-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div class="filter-container">
        <el-row>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">分类名称</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.name"
              placeholder="请输入分类名称"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">一级分类</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.first"
              clearable
              placeholder="请选择一级分类"
            >
              <el-option
                v-for="item in firstOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">二级分类</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.second"
              clearable
              placeholder="请选择二级分类"
            >
              <el-option
                v-for="item in secondOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">三级分类</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.third"
              clearable
              placeholder="请选择三级分类"
            >
              <el-option
                v-for="item in thirdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">分类显示</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.is_show"
              clearable
              placeholder="请选择是否分类显示"
            >
              <el-option
                v-for="item in isShowOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">状态</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.status"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>

            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleCreate"
            >新增</el-button>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :default-expand-all="false"
        row-key="id"
        :tree-props="{children: 'children'}"
      >
        <el-table-column label="ID" prop="type_id" align="center" width="100"></el-table-column>

        <el-table-column label="标签名称" align="center" >
          <template slot-scope="{row}">
            <div>
              <img
                v-if="row.image && row.image.length>0"
                class="garbage-img"
                :src="row.image"
                @click="handleGarbageImgPreview(row)"
              />
              <div>{{row.name}}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="标签别名" align="center" prop="alias"></el-table-column>
        <el-table-column label="来源" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.source | sourceFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类显示" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.is_show | isShowFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_time"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="update_time"></el-table-column>

        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button
              v-if="row.status == 2"
              type="success"
              size="mini"
              @click="changeStatus(row)"
            >上架</el-button>
            <el-button v-else type="info" size="mini" @click="changeStatus(row)">下架</el-button>
            <el-button
              v-if="row.status!='deleted'"
              size="mini"
              type="danger"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </el-card>

    <el-dialog
      custom-class="p-dialog"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="分类别名" prop="alias">
          <el-input v-model="temp.alias" />
        </el-form-item>
        <el-form-item label="父级分类" prop="alias">
          <el-select v-model="temp.parent_id" class="filter-item" placeholder="请选择" filterable clearable>
            <el-option
              v-for="(item,i) in handleTypeFilter(parentTypeOptions)"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.level != 3" label="子级分类" prop="alias">
          <el-select v-model="temp.children" class="filter-item" placeholder="请选择" filterable multiple clearable>
            <el-option
              v-for="(item,i) in  handleTypeFilter(childrenTypeOptions)"
              :key="i"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.parent_id == null || temp.parent_id == ''" label="排序" prop="sort" placeholder="请输入数字">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="temp.source" class="filter-item" placeholder="请选择">
            <el-option
              v-for="(item,i) in sourcesOptions"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类显示" prop="alias">
          <el-radio v-model="is_show" label="1">是</el-radio>
          <el-radio v-model="is_show" label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="封面图" prop="image" ref="uploadFormItem">
          <el-upload
            class="upload-demo"
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      custom-class="p-dialog"
      :visible.sync="dialogImgPreviewVisible"
      width="30%"
      size="tiny"
    >
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { fetchRecipeType, fetchCascadeRecipeType, insertRecipeType, delRecipeType, updateRecipeType, fetchAllRecipeType, updateRecipeTypeStatus,fetchRecipeTypeDetail} from "@/api/foodManager";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth";

// arr to obj, such as { 1 : "厨余垃圾", 2 : "可回收物" }
let garbageTypeKeyValue = null;

export default {
  name: "TagManager",
  components: { Pagination },
  filters: {
    statusFilter(val) {
      if (val == 1) {
        return "上架";
      } else {
        return "下架";
      }
    },
    isShowFilter(val) {
      if (val == 1) {
        return "是";
      } else {
        return "否";
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
      switch (val) {
        case 1:
          return "IOT";
          break;
        case 2:
          return "掌厨";
          break;
        case 3:
          return "运营编辑";
          break;

        default:
          return "";
          break;
      }
    }
    
  },
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      title: "食谱分类",
      list: null,
      total: 0,
      listLoading: true,
      isShowOptions: [{ value: 1, label: "是" }, { value: 2, label: "否" }],
      statusOptions: [{ value: 1, label: "上架" }, { value: 2, label: "下架" }],
      sourcesOptions: [
        { label: "IOT", value: 1 },
        { label: "掌厨", value: 2 },
        { label: "运营编辑", value: 3 }
      ],
      firstOptions: null,
      secondOptions: null,
      thirdOptions: null,

      parentTypeOptions: null,
      childrenTypeOptions: null,

      listQuery: {
        name: null,
        first: null,
        second: null,
        third: null,
        is_show: null,
        status: null, //状态
        page: 1,
        page_size: 20
      },

      is_show: "1",
      temp: {
        name: null,
        alias: null,
        parent_id: null,
        children: null,
        sort:null,
        is_show: null,
        source: null, //1iot 2掌厨 3运营编辑
        image: null,
        remark: null //备注
      },

      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        source: [{ required: true, message: "请选择来源", trigger: "change" }],
        name: [{ required: true, message: "请输入名字", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
      },
      dialogFormVisible: false,
      downloadLoading: false,
      uploadImgList: [],
      dialogImageUrl: "",
      dialogImgPreviewVisible: false,

      curRow: null
    };
  },
  computed: {
    uploadParam() {
      let param = {
        token: getToken()
      };
      return param;
    }
  },
  watch: {
    // 如果 `dialogFormVisible` 发生改变，这个函数就会运行
    dialogFormVisible: function(newV, oldV) {
      if (newV == false) {
        this.uploadImgList = [];
      }
    },
    'listQuery.first': function(newV, oldV) {
      for (let index = 0; index < this.firstOptions.length; index++) {
        const el = this.firstOptions[index];
        if (el.id == newV) {
          this.secondOptions = el.children
        }
      }
      if (newV == "" && oldV != null) {
        this.secondOptions = null
        this.thirdOptions = null
        this.listQuery.second = ''
        this.listQuery.third = ''
      }
    },
    'listQuery.second': function(newV, oldV) {
      for (let index = 0; index < this.secondOptions.length; index++) {
        const el = this.secondOptions[index];
        if (el.id == newV) {
          this.thirdOptions = el.children
        }
      }
      if (newV == "" && oldV != null) {
        this.thirdOptions = null
        this.listQuery.third = ''
      }
    }
  },
  created() {
    this.refreshList();
  },
  methods: {
    fetchOptionsList(){
      fetchCascadeRecipeType().then(res => {
        this.firstOptions = res.data
      })
      fetchAllRecipeType().then(res => {
        this.parentTypeOptions = res.data
        this.childrenTypeOptions = res.data
      })
    },
    /**
     * @description: 获取垃圾信息列表的数据
     */
    refreshList() {
      this.fetchOptionsList()
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;

      for (const key in this.listQuery) {
        // 去除对象内多余的空值key
        if (this.listQuery[key] == null || this.listQuery[key] === "") {
          delete this.listQuery[key];
        }
      }
      fetchRecipeType(this.listQuery).then(res => {
        this.total = res.data.total;
        this.list = res.data.data;
        this.listLoading = false;
      });
    },
    /**
     * @description: 重置缓存
     */
    resetTemp() {
      this.temp = {
        id: null,
        name: null,
        alias: null,
        parent_id: null,
        children: null,
        sort: null,
        is_show: null,
        source: null, //1iot 2掌厨 3运营编辑
        image: null,
        remark: null //备注
      };
      this.is_show = "1"
    },
    handleFilter() {
      this.refreshList();
    },
    /**
     * @description: 创建新的垃圾信息
     */
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.is_show = this.is_show;
          if (this.temp.parent_id != null && this.temp.parent_id != '') {
            this.temp.sort = null
          }
          insertRecipeType(this.temp).then(() => {
            this.dialogFormVisible = false;

            this.refreshList();
            this.$notify({
              title: "成功",
              message: "已成功创建",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    /**
     * @description: 编辑已有的垃圾信息
     * @param row
     */

    handleUpdate(cell) {
      
      fetchRecipeTypeDetail({id:cell.id}).then(res => {
        let row = res.data
        this.curRow = Object.assign({}, row)
        this.temp = Object.assign({}, row); // copy obj
        this.is_show = this.temp.is_show.toString()
        if (this.temp.parent_id == 0) {
          this.temp.parent_id = null
        }
        if (row.children.length>0) {
          let children = []
          for (let index = 0; index < row.children.length; index++) {
            const element = row.children[index];
            children.push(element.id)
          }
          this.curRow.children = children
          this.temp.children = children
        }

        if (row.image && row.image.length > 0) {
          this.uploadImgList = [{ url: row.image }];
        } else {
          this.uploadImgList = [];
        }

        console.log(this.uploadImgList);
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      })
 
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.is_show = this.is_show;
          if (this.temp.children == this.curRow.children) {
            this.temp.children = ''
          }
          if (this.temp.parent_id != null && this.temp.parent_id != '') {
            this.temp.sort = null
          }

          const tempData = Object.assign({}, this.temp);
          updateRecipeType(tempData).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    /**
     * @description: 删除垃圾信息
     * @param row
     */
    handleDelete(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRecipeType({ id: row.id }).then(() => {
            this.getList()
            this.fetchOptionsList()
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
    //上下架
    changeStatus(row) {
      let newRow = Object.assign({}, row);
      if (newRow.status == 1) {
        newRow.status = 2;
      } else {
        newRow.status = 1;
      }
      updateRecipeTypeStatus({
        id: newRow.id,
        status: newRow.status
      }).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功"
        });
      });
    },

    /**
     * @description: 上传成功
     */
    uploadImgSuccess(response, file, fileList) {
      console.log(response);
      if (fileList.length > 0) {
        this.temp.image = response.data.all_img_url;
        //移除必填的提醒
        // this.$refs["uploadFormItem"].clearValidate();
      } else {
        this.temp.image = "";
      }
    },
    /**
     * @description: 删除已上传图片
     */
    uploadImgRemove() {
      this.temp.image = "";
    },
    /**
     * @description: 表格图片预览
     * @param row
     */
    handleGarbageImgPreview(row) {
      this.dialogImageUrl = row.image;
      this.dialogImgPreviewVisible = true;
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
    handleTypeFilter(arr){
      //obj=>{temp.id == undefined||(temp.id != undefined&&obj.id!=temp.id)
      if (arr) {
        let types = []
        for (let index = 0; index < arr.length; index++) {
          let el = arr[index];
          if (this.temp.id == undefined) {
            types.push(el)
          } else {
            if (el.id != this.temp.id) {
              types.push(el)
            }
          }
        }
        return types
      } else {
        return []
      }
    }
  }
};
</script>

<style  lang="scss" scoped>
.garbage-img {
  object-fit: cover;
  width: 45px;
  height: 45px;
}
.filter-container {
  .filter-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    .filter-title {
      margin-right: 8px;
      min-width: 80px;
    }
    .filter-input {
      width: 250px;
    }
  }
}
</style>
<style>
.garbage-con .el-card__body {
  padding: 20px 40px;
}
.garbage-con .p-dialog {
  border-radius: 5px;
}
</style>

