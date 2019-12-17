<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t('manage.operation.commonProblem.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
        <el-button v-if="isAuth('commonproblem:commonproblem:save')" type="primary" @click="addOrUpdateHandle()">{{$t('common.add')}}</el-button>
<!--        <el-button v-if="isAuth('commonproblem:operatecommonproblem:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
<!--      <el-table-column-->
<!--        type="selection"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="50">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="id"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('manage.operation.commonProblem.id')"-->
<!--       >-->
<!--      </el-table-column>-->
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        :label="$t('manage.operation.commonProblem.title')">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="content"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="常见问题描述">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.operation.commonProblem.createTime')">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="createBy"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="updateTime"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="updateBy"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="">-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAuth('commonproblem:commonproblem:update')" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('common.update')}}</el-button>
          <el-button type="text" v-if="isAuth('commonproblem:commonproblem:delete')" size="small" @click="deleteHandle(scope.row)">{{$t('common.delete')}}</el-button>
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
  import {commonproblem} from '@/action/operatecommonproblem.js'
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
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name
        }
        commonproblem.list(params).then(({data}) => {

          if (data && data.code === 200) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
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
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },

      // 删除
      deleteHandle (row) {
        // console.log(row)
        let ids = [row.id];
        let title = row.title
        let content1 = this.$t('manage.coupon.buttonOperation.content1');
        content1 = content1.replace("title",title)
        this.$confirm(content1, this.$t('common.tips'), {
          confirmButtonText: this.$t("common.comfirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: 'warning'
        }).then(() => {
          commonproblem.del(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t("common.success"),
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
      },
      createAtTypeFormat(val){
        console.log(val)
        let createAt = val.createAt
        let date = new Date(val.createAt)
        var year = date.getFullYear()
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
      },
    }
  }
</script>
