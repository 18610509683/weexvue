<!--
 * @Description: 关怀管理页面
 -->

<template>
  <div class="app-container foodincome-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>关怀管理</span>
      </div>
      <div class="filter-container">
        <el-row>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="6">
            <div class="filter-title">标题/内容</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.key"
              placeholder="请输入关键字"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="6">
            <div class="filter-title">关怀类型</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.type"
              clearable
              placeholder="请选择类型"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="6">
            <div class="filter-title">关怀位置</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.position"
              clearable
              placeholder="请选择位置"
            >
              <el-option
                v-for="(item,index) in positionList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="6">
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
            <el-button size="small" type="primary" icon="el-icon-plus" @click="createItem">添加</el-button>
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
        <el-table-column  width="40" label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="关怀类型" width="100" align="center">
          <template slot-scope="scope">
            <span >{{scope.row.type | typeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="消息标题" align="center" :show-overflow-tooltip="true" prop="title"></el-table-column>
        <el-table-column label="消息内容" :show-overflow-tooltip="true" align="center" prop="content"></el-table-column>
        <el-table-column label="显示位置" align="center" width="100">
          <template slot-scope="scope">
            <span style="display: block" v-for="(item,index) in scope.row.show_position" :key="index">{{item | positionFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template slot-scope="{row}">
            <el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="create_at" width="160"></el-table-column>
        <el-table-column label="更新时间" align="center" prop="update_at" width="160"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="300"
        >
          <template slot-scope="{row}">
            <el-button type="warning" size="mini" v-if="row.status == 1" @click="handleStatus(row,2)">停用</el-button>
            <el-button type="success" size="mini" v-if="row.status == 2" @click="handleStatus(row,1)">启用</el-button>
            <el-button type="primary" size="mini" @click="updateItem(row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
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
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="状态" prop="isCompleted">
          <el-select v-model="temp.isCompleted" class="filter-item" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="temp.remark" type="textarea" rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
  .foodincome-con .el-card__body {
    padding: 20px 40px;
  }
  .foodincome-con .p-dialog {
    border-radius: 5px;
  }
</style>

<script>
import {
  fetchList,
  delItem,
  statusChange
} from "@/api/care.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "care",
  components: { Pagination },
  // 声明一个本地的过滤器
  filters: {
    typeFilter(val) {
      if (val === 1) {
        return '节日'
      } else if (val === 2) {
        return '天气'
      } else {
        return '人群'
      }
    },
    positionFilter(value) {
      if (value === '1') {
        return '屏保页'
      } else if (value === '2') {
        return '首页'
      } else {
        return '美居'
      }
    },
    statusFilter(val) {
      if (val === 1) {
        return '正常'
      } else {
        return '停用'
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
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        key: '',
        type: null,
        position: null,
        status: null,
        page: 1,
        page_size: 20
      },

      timeRange: '',
      typeList: [
        { label: '节日', value: 1 },
        { label: '天气', value: 2 },
        { label: '人群', value: 3 }
      ],
      positionList: [
        { label: '屏保', value: 1 },
        { label: '首页', value: 2 },
        { label: '美居', value: 3 }
      ],
      statusOptions: [{ label: '正常', value: 1 }, { label: '关闭', value: 2 }],

      temp: {
        remark: "",
        isCompleted: ""
      },
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      dialogFormVisible: false
    };
  },
  computed: {},
  watch: {},
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
      fetchList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.list = response.data.data;
        this.listLoading = false;
      });
    },

    handleFilter() {
      this.refreshList();
    },
    createItem() {
      this.$router.push({
        path: 'careAdd'
      })
    },
    updateItem(row) {
      this.$router.push({
        path: 'careUpdate',
        query: {
          id: row.id
        }
      })
    },
    handleStatus(row, status) {
      statusChange({ id: row.id, status: status }).then(() => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        });
      });
    },
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


