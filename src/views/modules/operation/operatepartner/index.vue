<template>
  <div class="mod-config">
<!--    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->

<!--      <el-form-item>-->
<!--&lt;!&ndash;        <el-button v-if="isAuth('partner:operatepartner:save')" type="primary" @click="addOrUpdateHandle()">{{$t('common.add')}}</el-button>&ndash;&gt;-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="id"-->
<!--        header-align="center"-->
<!--        align="center"-->

<!--        :label="$t('manage.operation.partner.id')">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        :label="$t('manage.operation.partner.title')">
      </el-table-column>

      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        :label="$t('manage.operation.partner.type')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1">{{$t('manage.operation.partner.type1')}}</el-tag>
          <el-tag v-if="scope.row.type==2">{{$t('manage.operation.partner.type2')}}</el-tag>
          <el-tag v-if="scope.row.type==3">{{$t('manage.operation.partner.type3')}}</el-tag>
        </template>
      </el-table-column>


      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAuth('partner:operatepartner:update')" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('common.update')}}</el-button>
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
  import {partner} from '@/action/operatepartner'
  import AddOrUpdate from './add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
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
          key: this.dataForm.key
        }
        partner.list(params).then(({data}) => {
          if (data && data.code === 200 ) {
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
        let ids = [row.id]
        let content1 = this.$t('manage.coupon.buttonOperation.content1');
        content1 = content1.replace("ids",ids)
        this.$confirm(content1, this.$t('common.tips'), {
          confirmButtonText: this.$t("common.comfirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: 'warning'
        }).then(() => {
          partner.del(ids).then(({data}) => {
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
      }



    }
  }
</script>
