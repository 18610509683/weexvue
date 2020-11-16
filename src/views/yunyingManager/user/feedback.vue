<!--
 * @Description: 垃圾信息管理页面
 -->
 
<template>
  <div class="app-container foodincome-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户反馈</span>
      </div>
      <div class="filter-container">
        <el-row>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">反馈时间</div>
            <el-date-picker
              class="filter-input"
              size="small"
              v-model="timeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
            ></el-date-picker>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">问题类型</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.suggestType"
              clearable
              placeholder="请选择问题类型"
            >
              <el-option
                v-for="item in suggestTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">冰箱型号</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.type"
              clearable
              placeholder="请选择冰箱型号"
            >
              <el-option
                v-for="(item,index) in typeOptions"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">状态</div>
            <el-select
              class="filter-input"
              size="small"
              v-model="listQuery.isCompleted"
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
            <div class="filter-title">反馈内容</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.suggestContent"
              placeholder="请输入反馈内容"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <div class="filter-title">应用版本</div>
            <el-input
              class="filter-input"
              size="small"
              v-model="listQuery.version"
              placeholder="请输入应用版本号"
            ></el-input>
          </el-col>
          <el-col class="filter-item" :xs="24" :sm="12" :lg="8">
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button
              size="small"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="exportData"
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
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column label="反馈内容" align="center" prop="suggestContent"></el-table-column>
        <el-table-column label="问题类型" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.suggestType | suggestTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" prop="contactInfo" width="120"></el-table-column>
        <el-table-column label="应用版本" align="center" prop="version" width="90"></el-table-column>
        <el-table-column label="冰箱型号" align="center" prop="type" width="120"></el-table-column>
        <el-table-column label="设备ID" align="center" prop="fridgeId" width="140"></el-table-column>
        <el-table-column label="账号uid" align="center" prop="userId" width="90"></el-table-column>
        <el-table-column label="反馈时间" align="center" prop="saveDate" width="100"></el-table-column>
        <el-table-column label="状态" align="center" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.isCompleted == 0? "正常" : "关闭"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="说明" align="center" prop="remark"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="100"
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
  fetchSuggestionList,
  updateSuggestion,
  fetchFridgeTypeList
} from "@/api/yunying.js";
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "foodIncome",
  components: { Pagination },
  // 声明一个本地的过滤器
  filters: {
    suggestTypeFilter: function(value) {
      switch (value) {
        case 0:
          return "其他问题";
          break;
        case 1:
          return "功能异常";
          break;
        case 2:
          return "性能异常";
          break;
        case 3:
          return "产品建议";
          break;
        default:
          return "";
          break;
      }
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        fridgeId: null, //冰箱id
        userId: null, //冰箱用户id
        type: null, //冰箱型号
        startDate: null, //开始时间 （日期到秒）
        endDate: null, //结束时间（日期到秒）
        suggestContent: null, //问题描述
        version: null, //客户端版本
        isCompleted: null, //是否完成 1完成 0 未完成
        suggestType: null, //0其他问题，1功能异常，2性能异常，3产品建议
        page: 1,
        page_size: 20
      },

      timeRange: "",
      suggestTypeOptions: [
        { label: "功能异常", value: 1 },
        { label: "性能异常", value: 2 },
        { label: "产品建议", value: 3 },
        { label: "其他问题", value: 0 }
      ],
      typeOptions: [],
      statusOptions: [{ label: "正常", value: 0 }, { label: "关闭", value: 1 }],

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
    fetchFridgeTypeList().then(res => {
      this.typeOptions = res.data;
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
      // console.log(this.timeRange)
      if (this.timeRange && this.timeRange.length > 0) {
        this.listQuery.startDate = this.timeRange[0];
        this.listQuery.endDate = this.timeRange[1];
      }
      this.listLoading = true;
      
      for (const key in this.listQuery) {
        // 去除对象内多余的空值key 
        //注意 0 == null  false
        //0 == '' true

        if (this.listQuery[key] == null || this.listQuery[key] === '') {
          delete this.listQuery[key];
        }
      }
      fetchSuggestionList(this.listQuery).then(response => {
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
     * @description: 编辑已有的垃圾信息
     * @param row
     */

    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      if (this.temp.fieldDetail == "") {
        this.temp.fieldDetail = "/";
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
          updateSuggestion(tempData).then(() => {
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
    exportData(){
      import('@/vendor/Export2Excel').then(excel => {
        
        let list = []
        for (let index = 0; index < this.list.length; index++) {
          let el = Object.assign({}, this.list[index]);
          switch (el.suggestType) {
            case 0:
              el.suggestType = "其他问题";
              break;
            case 1:
              el.suggestType = "功能异常";
              break;
            case 2:
              el.suggestType = "性能异常";
              break;
            case 3:
              el.suggestType = "产品建议";
              break;
            default:
              el.suggestType = "";
              break;
          }
          if (el.isCompleted == 0) {
            el.isCompleted = '正常'
          } else {
            el.isCompleted = '关闭'
          }
          list.push(el)
        }

        const tHeader = ['反馈内容', '问题类型', '联系方式', '应用版本', '冰箱型号', '设备ID', '账号uid', '反馈时间', '状态']
        const filterVal = ['suggestContent', 'suggestType', 'contactInfo', 'version', 'type', 'fridgeId', 'userId', 'saveDate', 'isCompleted']
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '反馈信息',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'rate') {
          return (parseFloat(v[j])*100).toFixed(2) + '%'
        } else {
          return v[j]
        }
      }))
    }
  }
};
</script>



