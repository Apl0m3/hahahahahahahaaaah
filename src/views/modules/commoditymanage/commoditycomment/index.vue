<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.transactionId" :placeholder="$t('manage.commodity.commodityComment.transactionIdPla')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.userName" :placeholder="$t('manage.commodity.commodityComment.userNamePla')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
<!--        <el-button v-if="isAuth('manage:commoditycomment:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
<!--        <el-button v-if="isAuth('manage:commoditycomment:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
<!--      <el-table-column-->
<!--        prop="id"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="编号">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="transactionId"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityComment.transactionId')">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityComment.userName')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityComment.createTime')">
      </el-table-column>
      <el-table-column
        prop="commodityName"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityComment.commodityName')">
      </el-table-column>


      <el-table-column
        prop="comment"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityComment.comment')">
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodityComment.readStatus')">
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.readStatus"
              :active-value="1"
              :inactive-value="0"
              disabled>
            </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
                   <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">{{$t('common.detail')}}</el-button>
<!--          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
  import {commodityComment} from '@/action/commoditycomment'
  import AddOrUpdate from './add-or-update'
  export default {
    data () {
      return {
        dataForm: {
          transactionId: '',
          userName:''
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
        if(!this.checkPhone()){
          this.$message.error(this.$t('common.mailError'));
          return;
        }
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          transactionId: this.dataForm.transactionId,
          userName:this.dataForm.userName
        }
        commodityComment.list(params).then(({data}) => {
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
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row.id,row.transactionId,row.comment)
        })
      },
      // 删除
      // deleteHandle (id) {
      //   var ids = id ? [id] : this.dataListSelections.map(item => {
      //     return item.id
      //   })
      //   this.$confirm(`确定进行[删除]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     commodityComment.del(ids).then(({data}) => {
      //       if (data && data.code === 200) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.getDataList()
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   })
      // },
      checkPhone(){
        let value=this.dataForm.userName;
        if (value) {
          // const reg = /^(1|8)[0-9]\d{9}$/;
            let reg=/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
          if (reg.test(value))
            return true
          else
            return false;
        }else{
          return true
        }
      }
    }
  }
</script>
