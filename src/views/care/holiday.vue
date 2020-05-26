<!--
 * @Description: 节日配置管理页面
 -->

<template>
  <div class="app-container garbage-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
      </div>
      <div class="filter-container">
        <el-row>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="4">
            <div class="filter-title">名称</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.name"
              placeholder="请输入关键字"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="4">
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
          <el-col class="filter-item" :xs="24" :sm="12" :lg="4">
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
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
      >
        <el-table-column label="ID" prop="id" align="center" width="80"></el-table-column>
        <el-table-column label="标签名称" align="center" prop="name"></el-table-column>
        <el-table-column label="标签名称" align="center" prop="date"></el-table-column>
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
            >启用</el-button>
            <el-button v-else type="info" size="mini" @click="changeStatus(row)">停用</el-button>
            <el-button
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="temp.date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
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
import {
  fetchList,
  createItem,
  updateItem,
  statusChange
} from "@/api/holiday.js";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth";

export default {
  name: 'Holiday',
  components: { Pagination },
  filters: {
    statusFilter(val) {
      if (val === 1) {
        return '正常';
      } else {
        return '停用';
      }
    },
    tagCssFilter(type) {
      let css = {
        "1": "success",
        "2": "info"
      };
      return css[type];
    },
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
      statusOptions: [{ value: 1, label: '正常' }, { value: 2, label: '停用' }],
      listQuery: {
        name: null,
        status: null,
        page: 1,
        page_size: 20
      },
      temp: {
        name: "",
        date: "",
        remark: ""
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
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
    dialogFormVisible: function(newV, oldV) {
      if (newV == false) {
        this.uploadImgList = [];
      }
    }
  },
  created() {
    this.refreshList()
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
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
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
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.type_id = this.type_id;
          createItem(this.temp).then(() => {
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

    // 编辑
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      if (row.image && row.image.length > 0) {
        this.uploadImgList = [{ url: row.image }];
      } else {
        this.uploadImgList = [];
      }
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
          updateItem(tempData).then(() => {
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
    // 删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          statusChange({ id: row.id, status: 3}).then(() => {
            this.getList();
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
    // 上下架
    changeStatus(row) {
      let newRow = Object.assign({}, row);
      if (newRow.status == 1) {
        newRow.status = 2;
      } else {
        newRow.status = 1;
      }
      newRow.alias = newRow.name_alias;
      statusChange(newRow).then(() => {
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

<style scoped lang="scss">
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
      margin-right: 20px;
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

