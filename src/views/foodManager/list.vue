<!--
 * @Description: 垃圾信息管理页面
 -->

<template>
  <div class="app-container foodincome-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>食材列表</span>
      </div>
      <div class="filter-container">
        <el-row>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">食材名称</div>
            <el-input class="filter-input" size="small" v-model="listQuery.name" placeholder="食材名称"></el-input>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">食材分类</div>
            <el-select class="filter-input" size="small" v-model="listQuery.categoryId" placeholder="食材分类" clearable>
              <el-option v-for="(item,index) in foodCategoryOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">时令</div>
            <el-select class="filter-input" size="small" v-model="listQuery.season" placeholder="时令" clearable>
              <el-option v-for="item in seasonOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">节日</div>
            <el-select class="filter-input" size="small" v-model="listQuery.festival" placeholder="节日" clearable>
              <el-option v-for="item in festivalOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">适宜人群</div>
            <el-select class="filter-input" size="small" v-model="listQuery.people" placeholder="适宜人群" clearable>
              <el-option v-for="item in peopleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">功效</div>
            <el-select class="filter-input" size="small" v-model="listQuery.effect" placeholder="功效"
                       clearable>
              <el-option v-for="item in effectOptions" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">适宜疾病</div>
            <el-select class="filter-input" size="small" v-model="listQuery.suitableSick" placeholder="适宜疾病"
                       clearable>
              <el-option v-for="item in sickOptions" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="12" :sm="8" :lg="6">
            <div class="filter-title">适宜阶段</div>
            <el-select class="filter-input" size="small" v-model="listQuery.suitablePhysiology" placeholder="适宜阶段"
                       clearable>
              <el-option v-for="item in physiologyOptions" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="6">
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="toCreate()" >新建食材</el-button>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
      </div>

      <el-table v-loading="listLoading" :data="list"  @sort-change="sortChange" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column label="食材名称" align="center" prop="name"></el-table-column>
        <el-table-column label="食材别名" align="center" prop="aliasName"></el-table-column>
        <el-table-column label="食材分类" align="center" prop="categoryName"></el-table-column>
        <el-table-column label="来源" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.source | sourceFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时令" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.season}}</span>
          </template>
        </el-table-column>
        <el-table-column label="节日" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.festival}}</span>
          </template>
        </el-table-column>
        <el-table-column label="功效" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.effect}}</span>
          </template>
        </el-table-column>
        <el-table-column label="适宜人群" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.suitablePeople}}</span>
          </template>
        </el-table-column>
        <el-table-column label="适宜阶段" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.suitablePhysiology}}</span>
          </template>
        </el-table-column>
        <el-table-column label="适宜疾病" align="center" :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            <span>{{scope.row.suitableSick}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | tagCssFilter">{{ row.status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="toCreate(row.id)">编辑</el-button>
            <el-button v-if="row.status !== 1" type="success" size="mini" @click="changeStatus(row)">上架</el-button>
            <el-button v-else type="info" size="mini" @click="changeStatus(row)">下架</el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
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
      margin-right: 3px;
      min-width: 80px;
    }
    .filter-input {
      width: 160px;
    }
  }
}
</style>
<style>
.foodInCome-con .el-card__body {
  padding: 20px 40px;
}
.foodInCome-con .p-dialog {
  border-radius: 5px;
}
</style>

<script>
import {
  fetchFoodList,
  fetchAllTag,
  fetchAllFoodType,
  updateFoodStatus,
  delFood
} from "@/api/foodManager.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "foodIncome",
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
      if (val === 1) {
        return "IOT";
      } else if (val === 2) {
        return "掌厨";
      } else {
        return "运营编辑";
      }
    }
  },
  data() {
    return {
      list: [],
      total: 3,
      listLoading: true,
      listQuery: {
        name: null, //食材名称
        categoryId: null, //食材分类id
        season: null, //时令
        festival: null, //节日
        function: null, //功效
        people: null, //适应人群
        sick: null, //疾病
        physiology: null, //生理阶段
        effect: null, //功效
        suitablePeople: null, //适应人群
        suitableSick: null, //适宜疾病
        suitablePhysiology: null, //适宜生理阶段
        page: 1,
        page_size: 20
      },

      timeRange: "",
      effectOptions: [],
      sickOptions: [],
      foodCategoryOptions: [],
      physiologyOptions: [],
      seasonOptions: [],
      festivalOptions: [],
      peopleOptions: [],
      downloadLoading: false
    };
  },
  computed: {},
  watch: {},
  created() {
    fetchAllFoodType().then(res => {
      this.foodCategoryOptions = res.data;
    });

    fetchAllTag({ type_id: 1 }).then(res => {
      //获取时令季节数据
      this.seasonOptions = res.data[1];
      //获取节日数据
      this.festivalOptions = res.data[2];
      //获取适应人群数据
      this.peopleOptions = res.data[3];
      //获取设备品类数据
      this.deviceOptions = res.data[10];
      //获取功效数据
      this.effectOptions = res.data[5];
      //获取适宜疾病数据
      this.sickOptions = res.data[6];
      //获取生理阶段数据
      this.physiologyOptions = res.data[4];
    });
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

      fetchFoodList(this.listQuery).then(response => {
        this.total = response.data.total;
        this.list = response.data.data;
        this.listLoading = false;
      });
    },

    handleFilter() {
      this.refreshList();
    },
    sortChange(data) {
      console.log(data);
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
          delFood({ id: row.id }).then(() => {
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
      updateFoodStatus(newRow).then(() => {
        this.getList();
        this.$message({
          type: "success",
          message: "操作成功"
        });
      });
    },
    //跳转创建编辑页面
    toCreate(id) {
      if (id) {
        this.$router.push("/foodmanager/edit/" + id);
      } else {
        this.$router.push("/foodmanager/create");
      }
    }
  }
};
</script>



