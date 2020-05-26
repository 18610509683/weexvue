<!--
 * @Description: 垃圾信息管理页面
 -->
 
<template>
  <div class="app-container foodincome-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>食材收入</span>
      </div>
      <div class="filter-container">
        <el-row>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">时间</div>
            <el-date-picker
              class="filter-input"
              size="small"
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">类型</div>
            <el-select class="filter-input" size="small" v-model="type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">食材分类</div>
            <el-select class="filter-input" size="small" v-model="foodType" placeholder="请选择">
              <el-option
                v-for="item in foodTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">食材ID</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.foodId"
              placeholder="请输入食材ID"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">食材名称</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.foodName"
              placeholder="请输入食材名称"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button
              size="small"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="handleFilter"
            >导出</el-button>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        @sort-change="sortChange"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="食材ID" align="center" prop="id"></el-table-column>
        <el-table-column label="食材名称" align="center" prop="name"></el-table-column>
        <el-table-column label="类型" align="center" prop="type"></el-table-column>
        <el-table-column label="食材分类" align="center" prop="foodType"></el-table-column>
        <el-table-column label="购物车曝光量" align="center" prop="baoguang"></el-table-column>
        <el-table-column label="购物车点击量" align="center" prop="baoguang"></el-table-column>
        <el-table-column label="订单总量" align="center" prop="baoguang"></el-table-column>
        <el-table-column label="订单成功量" align="center" prop="baoguang"></el-table-column>
        <el-table-column label="消费总额" align="center" prop="baoguang" sortable="custom"></el-table-column>
        <el-table-column label="佣金总额" align="center" prop="baoguang" sortable="custom"></el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
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
  createItem,
  updateItem,
  delItem
} from "@/api/pinleiConfig.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "foodIncome",
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: [
        {
          id: "111",
          name: "萝卜",
          type: "食材",
          foodType: "蔬菜",
          baoguang: "1111111"
        },
        {
          id: "111",
          name: "萝卜",
          type: "食材",
          foodType: "蔬菜",
          baoguang: "1111111"
        },
        {
          id: "111",
          name: "萝卜",
          type: "食材",
          foodType: "蔬菜",
          baoguang: "1111111"
        }
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        cname: "",
        page: 1,
        page_size: 20
      },

      timeRange: "",
      type: 0,
      typeOptions: [{ label: "全部", value: 0 },{ label: "食材", value: 1 }, { label: "调料", value: 2 }],
      foodType: 0,
      foodTypeOptions: [
        { label: "全部", value: 0 },
        { label: "蔬菜", value: 1 },
        { label: "畜肉类", value: 2 },
        { label: "禽肉类", value: 3 }
      ],
      downloadLoading: false
    };
  },
  computed: {},
  watch: {},
  created() {
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
        if (this.listQuery[key] === null) {
          delete this.listQuery[key];
        }
      }

      fetchList(this.listQuery).then(response => {
        // this.total = response.data.total;
        // this.list = response.data.data;
        this.listLoading = false;
      });
    },

    handleFilter() {
      this.refreshList();
    },
    sortChange(data){
      console.log(data)
    }
  }
};
</script>



