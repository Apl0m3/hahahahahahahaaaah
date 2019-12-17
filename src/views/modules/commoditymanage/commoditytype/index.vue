<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t('manage.commodity.commodityType.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>

        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>

        <el-button v-if="isAuth('manage:commoditytype:save')" type="primary" @click="addOrUpdateHandle()">{{$t('common.add')}}</el-button>
<!--
        <el-button v-if="isAuth('manage:commoditytype:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
-->
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">

<!--      <el-table-column-->
<!--        prop="id"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('manage.commodity.commodityType.id')">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityType.name')">
      </el-table-column>
      <el-table-column
      prop="image"
      header-align="center"
      align="center"
      :label="$t('manage.commodity.commodityType.image')">
      <template slot-scope="scope">
        <img width="100px" height="100px" :src="global.showUrl+scope.row.image"/>
      </template>
    </el-table-column>
      <el-table-column
        prop="commission"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityType.commission')">
      </el-table-column>
      <el-table-column
        prop="createSysUserName"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityType.createSysUserName')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityType.createTime')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('manage.commodity.commodityType.operation')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('manage:commoditytype:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('common.update')}}</el-button>
          <el-button v-if="isAuth('manage:commoditytype:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import {commoditytype} from '@/action/commoditytype'
  import AddOrUpdate from './add-or-update'

  export default {
    data () {
      return {
        dataForm: {
          name: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name
        }
        commoditytype.list(params).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          // console.log(this.dataList)
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
          console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        let deletePrompt = this.$t('prompt.delete')
        let title = this.$t('prompt.title')
        this.$confirm(deletePrompt, title, {
          confirmButtonText: this.$t('common.comfirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          commoditytype.del(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
