<!--
 * @Description: 系统配置页面
 -->
 
<template>
  <div class="app-container garbage-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>食谱参数配置</span>
      </div>
      <div class="filter-container">
        <span>字段类型：</span>
        <el-input
          class="filter-item"
          style="width: 180px;margin-left: 10px;"
          v-model="listQuery.fieldType"
          placeholder="请输入字段类型"
        ></el-input>
        <span style="margin-left: 15px;">子分类：</span>
        <el-input
          class="filter-item"
          style="width: 180px;margin-left: 10px;"
          v-model="listQuery.fieldClassify"
          placeholder="请输入子分类"
        ></el-input>

        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >查询</el-button>
        
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          type="index"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column label="字段类型">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.fieldType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子分类">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.fieldClassify }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字段详情" width="160" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.fieldDetail }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字段值" align="center" width="160">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.fieldValue }}</span>
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
        <el-form-item label="字段类型" prop="type">
          <el-input v-model="temp.fieldType" :disabled="true" />
        </el-form-item>
        <el-form-item label="子分类" prop="cg">
          <el-input v-model="temp.fieldClassify" :disabled="true" />
        </el-form-item>
        <el-form-item label="字段详情" prop="detail">
          <el-input v-model="temp.fieldDetail" :disabled="true" />
        </el-form-item>
        <el-form-item label="字段值" prop="fieldValue">
          <el-input v-model="temp.fieldValue" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>

    
  </div>
</template>

<script>
import {
  fetchConfigList,
  updateConfig
} from "@/api/recipesConfig";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getToken } from "@/utils/auth";


export default {
  name: "Garbage",
  components: { Pagination },
  filters: {
    
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        fieldType: null,
        fieldClassify: null,
        page: 1,
        page_size: 20
      },
      temp: {
        fieldType: "",
        fieldClassify: "",
        fieldDetail: "",
        fieldValue: null
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        fieldValue: [
          { required: true, message: "请输入字段值", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
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
      }
    }
  },
  created() {
    this.getList()
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
        if (this.listQuery[key] === null) {
          delete this.listQuery[key]
        }
      }

      fetchConfigList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.list = response.data.data;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.refreshList();
    },
    /**
     * @description: 编辑已有的垃圾信息
     * @param row
     */

    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      if (this.temp.fieldDetail == '') {
        this.temp.fieldDetail = '/'
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
          if (tempData.fieldDetail == '/') {
            tempData.fieldDetail == ''
          }
          updateConfig(tempData).then(() => {
           
            this.dialogFormVisible = false;

            // for (const v of this.list) {
            //   if (v.id === this.temp.id) {
            //     const index = this.list.indexOf(v);
            //     this.list.splice(index, 1, tempData);
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
.filter-container .filter-item {
    vertical-align: inherit;
}
</style>

