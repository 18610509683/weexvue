<!--
 * @Description: 垃圾信息管理页面
 -->
 
<template>
  <div class="app-container garbage-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>品类信息列表</span>
      </div>
      <div class="filter-container">
        <el-input
          class="filter-item"
          style="width: 180px;margin-left: 10px;"
          v-model="listQuery.cname"
          placeholder="请输入品类名称"
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
        <el-table-column label="品类名称" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.cname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否展示" align="center">
          <template slot-scope="{row}">
            <span class="link-type">{{ row.is_display && row.is_display == 1 ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column
          label="操作"
          align="center"
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
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        
        <el-form-item label="品类名称" prop="cname" >
          <el-input v-model="temp.cname" />
        </el-form-item>
        <el-form-item label="是否展示" prop="is_display">
          <el-select v-model="temp.is_display" class="filter-item" placeholder="请选择">
            <el-option :key="1" label="是" :value="1"/>
            <el-option :key="0" label="否" :value="0"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createItem,
  updateItem,
  delItem
} from "@/api/pinleiConfig.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

// arr to obj, such as { 1 : "厨余垃圾", 2 : "可回收物" }
let garbageTypeKeyValue = null;

export default {
  name: "Pinlei",
  components: { Pagination },
  filters: {
    
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        cname: "",
        page: 1,
        page_size: 20,
      },
      temp: {
        id: null,
        cname: "",
        is_display: null
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        is_display: [
          { required: true, message: "请选择是否显示", trigger: "change" }
        ],
        cname: [{ required: true, message: "请输入品类名字", trigger: "blur" }],
      },
      dialogFormVisible: false,
      downloadLoading: false,
    };
  },
  computed: {
  },
  watch: {
    
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
      this.listLoading = true;

      for (const key in this.listQuery) {              // 去除对象内多余的空值key
        if (this.listQuery[key] === null) {
          delete this.listQuery[key]
        }
      }

      fetchList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.list = response.data.data;
        this.listLoading = false;
      });
    },
    /**
     * @description: 重置缓存
     */
    resetTemp() {
      this.temp = {
        id: null,
        cname: "",
        is_display: null
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
    /**
     * @description: 编辑已有的品类信息
     * @param row
     */

    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      

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
    /**
     * @description: 删除品类信息
     * @param row
     */
    handleDelete(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delItem({ id: row.id }).then(() => {
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
    }
  }
};
</script>

<style scoped>

</style>
<style>
.garbage-con .el-card__body {
  padding: 20px 40px;
}
.garbage-con .p-dialog {
  border-radius: 5px;
}
</style>

