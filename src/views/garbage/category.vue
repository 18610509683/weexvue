<!--
 * @Description: 垃圾分类信息管理页面
 -->

 
<template>
  <div class="app-container garbage-category-con">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>垃圾分类信息列表</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="分类名称" width="150">
          <template slot-scope="{row}">
            <span class="link-type" @click="handleUpdate(row)">{{ row.cname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="{row}">
            {{ row.description}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    
  </div>
</template>

<script>
import { fetchCategoryList } from '@/api/garbage'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'GarbageGategory',
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * @description: 获取垃圾信息列表的数据
     */
    getList() {
      this.listLoading = true
      fetchCategoryList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>

