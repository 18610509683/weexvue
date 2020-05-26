<!--
 * @Description: 垃圾信息管理页面
 -->
 
<template>
  <div class="app-container garbage-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>垃圾信息列表</span>
      </div>
      <div class="filter-container">
        <el-select
          v-model="listQuery.category_id"
          placeholder="垃圾类型"
          clearable
          class="filter-item"
          style="width: 130px"
          @change="refreshList()"
        >
          <el-option
            v-for="item in garbageTypeOptions"
            :key="item.id"
            :label="item.cname"
            :value="item.id"
          />
        </el-select>

        <el-select
          v-model="listQuery.is_set_img"
          placeholder="有无图片"
          clearable
          class="filter-item"
          style="width: 130px;margin-left: 10px;"
          @change="refreshList()"
        >
          <el-option
            v-for="item in hasPicOptions"
            :key="item.id"
            :label="item.cname"
            :value="item.id"
          />
        </el-select>

        <el-input
          class="filter-item"
          style="width: 180px;margin-left: 10px;"
          v-model="listQuery.cname"
          placeholder="请输入垃圾名称"
        ></el-input>

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
        @sort-change="sortChange"
      >
        <el-table-column
          label="ID"
          prop="id"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="垃圾名称">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.cname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{row}">
            <img
              v-if="row.img_url && row.img_url.length>0"
              class="garbage-img"
              :src="row.img_url"
              @click="handleGarbageImgPreview(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.sorts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="垃圾类型" align="center" class-name="status-col" width="160">
          <template slot-scope="{row}">
            <el-tag :type="row.category_id | tagCssFilter">{{ row.category_id | typeFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="230"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
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
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="类型" prop="category_id">
          <el-select v-model="temp.category_id" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in garbageTypeOptions"
              :key="item.id"
              :label="item.cname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="cname">
          <el-input v-model="temp.cname" />
        </el-form-item>
        <el-form-item label="排序" prop="sorts">
          <el-input v-model.number="temp.sorts" />
        </el-form-item>

        <el-form-item label="图片" prop="img_url" ref="uploadFormItem">
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
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-alert
          title="排序"
          type="info"
          description="值越大，越靠前"
          show-icon style="margin-bottom: 10px;">
        </el-alert>
        <el-alert
          title="图片上传"
          type="info"
          description="300*300正方形500k以下下图片"
          show-icon>
        </el-alert>
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
  createGarbage,
  updateGarbage,
  delGarbage,
  fetchCategoryList
} from "@/api/garbage";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth";

// arr to obj, such as { 1 : "厨余垃圾", 2 : "可回收物" }
let garbageTypeKeyValue = null;

export default {
  name: "Garbage",
  components: { Pagination },
  filters: {
    typeFilter(type) {
      return garbageTypeKeyValue[type];
    },
    tagCssFilter(type) {
      let css = {
        "1": "info",
        "2": "success",
        "3": "danger",
        "4": "warning"
      };
      return css[type];
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      garbageTypeOptions: [],
      hasPicOptions: [{ id: 0, cname: "无图片" }, { id: 1, cname: "有图片" }],
      listQuery: {
        cname: null,
        page: 1,
        page_size: 20,
        category_id: null,
        is_set_img: null //所有（有图无图）
      },
      temp: {
        cname: "",
        category_id: "",
        img_url: "",
        sorts: 50
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        category_id: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        cname: [{ required: true, message: "请输入名字", trigger: "blur" }],
        sorts: [
          { type: "number", message: "sorts必须为数字值" },
          { required: true, message: "请输入sorts值", trigger: "blur" }
        ]
        // img_url: [{ required: true, message: "请上传图片" }]
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
    this.getCategoryList();
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

      for (const key in this.listQuery) {              // 去除对象内多余的空值key
        if (this.listQuery[key] == null || this.listQuery[key] === '') {
          delete this.listQuery[key]
        }
      }

      fetchList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.list = response.data.data;
        this.listLoading = false;
      });
    },
    getCategoryList() {
      fetchCategoryList().then(response => {
        console.log(response);
        this.garbageTypeOptions = response.data;
        // 返回id为数字类型
        // console.log(typeof(this.garbageTypeOptions[0].id)) number
        // debugger
        // arr to obj, such as { 1 : "厨余垃圾", 2 : "可回收物" }
        garbageTypeKeyValue = this.garbageTypeOptions.reduce((acc, cur) => {
          acc[cur.id] = cur.cname;
          return acc;
        }, {});

        this.getList();
      });
    },
    /**
     * @description: 重置缓存
     */
    resetTemp() {
      this.temp = {
        id: undefined,
        cname: "",
        category_id: "",
        img_url: "",
        sorts: 50
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
          createGarbage(this.temp).then(() => {
            // this.list.unshift(this.temp);
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
      if (row.img_url && row.img_url.length > 0) {
        this.uploadImgList = [{ url: row.img_url }];
      } else {
        this.uploadImgList = [];
      }

      this.temp.img_url = row.img_url.split("/").pop();
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
          updateGarbage(tempData).then(() => {
            this.dialogFormVisible = false;
            
            // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v);
            //     this.list.splice(index, 1, this.temp);
            //     break;
            //   }
            // }

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
          delGarbage({ id: row.id }).then(() => {
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
    /**
     * @description: 排序
     */
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
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
     * @description: 添加升序或降序的样式
     */
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
    },
    /**
     * @description: 上传成功
     */
    uploadImgSuccess(response, file, fileList) {
      console.log(response);
      if (fileList.length > 0) {
        this.temp.img_url = response.data.img_url;
        //移除必填的提醒
        // this.$refs["uploadFormItem"].clearValidate();
      } else {
        this.temp.img_url = "";
      }
    },
    /**
     * @description: 删除已上传图片
     */
    uploadImgRemove() {
      this.temp.img_url = "";
    },
    /**
     * @description: 表格图片预览
     * @param row
     */
    handleGarbageImgPreview(row) {
      this.dialogImageUrl = row.img_url;
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

