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
        <el-input
          class="filter-item"
          style="width: 180px;margin-right: 10px;"
          v-model="listQuery.name"
          placeholder="请输入标签名称"
        ></el-input>
        <el-select
          v-model="listQuery.source"
          placeholder="来源"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="(item,i) in sourcesOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select
          v-model="listQuery.status"
          placeholder="状态"
          clearable
          class="filter-item"
          style="width: 130px;margin-left: 10px;"
        >
          <el-option
            v-for="(item,i) in statusOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

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
        <!-- <el-button
          :loading="downloadLoading"
          class="filter-item upload-img-con"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>-->
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>

        <el-table-column label="标签名称" align="center">
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

        <el-table-column label="标签别名" align="center" prop="name_alias"></el-table-column>
        <el-table-column label="来源" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.source | sourceFilter}}</span>
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
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="标签别名" prop="alias">
          <el-input v-model="temp.alias" />
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
import { fetchTagList, addTag, updateTag, delTag } from "@/api/tagManager";
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
      title: "",
      list: null,
      total: 0,
      type_id: null,
      listLoading: true,
      statusOptions: [{ value: 1, label: "上架" }, { value: 2, label: "下架" }],
      sourcesOptions: [
        { label: "IOT", value: 1 },
        { label: "掌厨", value: 2 },
        { label: "运营编辑", value: 3 }
      ],
      listQuery: {
        name: null,
        source: null, //来源
        status: null, //状态
        type_id: null, //标签类型
        page: 1,
        page_size: 20
      },
      temp: {
        name: "",
        alias: "",
        source: "",
        image: "",
        remark: ""
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        source: [{ required: true, message: "请选择来源", trigger: "change" }],
        name: [{ required: true, message: "请输入名字", trigger: "blur" }]
      },
      dialogFormVisible: false,
      downloadLoading: false,
      uploadImgList: [],
      dialogImageUrl: "",
      dialogImgPreviewVisible: false
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
    }
  },
  created() {
    switch (this.type) {
      case "Season":
        this.title = "时令";
        this.type_id = 1;
        break;

      case "Crowd":
        this.title = "人群";
        this.type_id = 3;
        break;

      case "Disease":
        this.title = "疾病";
        this.type_id = 6;
        break;

      case "Effect":
        this.title = "功效";
        this.type_id = 5;
        break;

      case "Festival":
        this.title = "节日";
        this.type_id = 2;
        break;

      case "LifeStage":
        this.title = "生理阶段";
        this.type_id = 4;
        break;

      case "Taste":
        this.title = "口味";
        this.type_id = 7;
        break;

      case "Caixi":
        this.title = "菜系";
        this.type_id = 8;
        break;

      case "Caishi":
        this.title = "菜式";
        this.type_id = 9;
        break;

      case "ShebeiPinlei":
        this.title = "设备品类";
        this.type_id = 10;
        break;

      case "PengrenFangshi":
        this.title = "烹饪方式";
        this.type_id = 11;
        break;

      case "Zhiye":
        this.title = "职业";
        this.type_id = 12;
        break;

      default:
        break;
    }
    this.refreshList();
  },
  methods: {
    /**
     * @description: 获取垃圾信息列表的数据
     */
    refreshList() {
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
      this.listQuery.type_id = this.type_id;
      fetchTagList(this.listQuery).then(res => {
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
        id: undefined,
        name: "",
        alias: "",
        source: "",
        image: "",
        remark: ""
      };
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
          this.temp.type_id = this.type_id;
          addTag(this.temp).then(() => {
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

    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
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
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateTag(tempData).then(() => {
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
          delTag({ id: row.id }).then(() => {
            for (const v of this.list) {
              if (v.id === row.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1);
                break;
              }
            }
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
      newRow.alias = newRow.name_alias;
      updateTag(newRow).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功"
        });
      });
    },

    /**
     * @description: 把表格数据导出execl
     */
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["id", "名字", "图片地址", "分类"];
        const filterVal = ["id", "cname", "img_url", "category_id"];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "垃圾信息列表"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "category_id") {
            return garbageTypeKeyValue[v[j]];
          } else {
            return v[j];
          }
        })
      );
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
    }
  }
};
</script>

<style scoped>
.garbage-img {
  object-fit: cover;
  width: 45px;
  height: 45px;
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

