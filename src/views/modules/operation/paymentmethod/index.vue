<template>
  <div class="mod-config">
<!--    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
<!--      <el-form-item>-->
<!--        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button @click="getDataList()">查询</el-button>-->
<!--&lt;!&ndash;        <el-button v-if="isAuth('manage:paymentmethod:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button v-if="isAuth('manage:paymentmethod:delete')" type="danger" @click="deleteHandle()"&ndash;&gt;-->
<!--&lt;!&ndash;                   :disabled="dataListSelections.length <= 0">批量删除&ndash;&gt;-->
<!--&lt;!&ndash;        </el-button>&ndash;&gt;-->
<!--      </el-form-item>-->
<!--    </el-form>-->
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
<!--        :label="$t('common.num')">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.operation.payment.name')">
      </el-table-column>
      <el-table-column
        prop="image"
        header-align="center"
        align="center"
        :label="$t('manage.operation.payment.image')">
        <template slot-scope="scope">
          <img :src="global.showUrl+scope.row.image" alt="" style="width: 50px;height: 50px"
               v-if="scope.row.image!==null">
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('manage.operation.payment.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" size="small">{{$t('manage.operation.payment.status1')}}</el-tag>
          <el-tag v-if="scope.row.status==1" size="small" type="danger">{{$t('manage.operation.payment.status2')}}</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="paymentType"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('manage.operation.payment.status')">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag v-if="scope.row.paymentType==1">{{$t('manage.operation.payment.wx')}}</el-tag>-->
<!--          <el-tag v-if="scope.row.paymentType==2">{{$t('manage.operation.payment.wxAndIntegral')}}</el-tag>-->
<!--          <el-tag v-if="scope.row.paymentType==3">{{$t('manage.operation.payment.df')}}</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="createSysUserName"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="创建用户">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.operation.payment.createTime')">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="updateSysUserName"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="修改用户">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="updateTime"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="修改时间">-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('manage.operation.payment.edit')}}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row)">{{$t('manage.operation.payment.delete')}}</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" :typeId="typeId" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import {paymentmethod} from '@/action/paymentmethod'
  import AddOrUpdate from './add-or-update'

  export default {
    data() {
      return {
        typeId:'',
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
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        var params = {
          curPage:this.pageIndex,
          pageSize: this.pageSize,
          key: this.dataForm.key
        }
        paymentmethod.list(params).then(({data}) => {
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
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        if(id == 2){
          this.typeId = false;
        }else {
          this.typeId = true;
        }
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle(row) {
        let ids = [row.id];
        let title = row.name;
        let content1 = this.$t('manage.coupon.buttonOperation.content1');
        content1 = content1.replace("title",title)
        this.$confirm(content1, this.$t('common.tips'), {
          confirmButtonText: this.$t("common.comfirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: 'warning'
        }).then(() => {
          paymentmethod.del(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
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
      // disableEnable(row) {
      //   let id, status;
      //   if (row) {
      //     id=row.id;
      //     status=row.status
      //   }
      //   this.$confirm(`确定进行[${status ? '禁用' : '启用'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     paymentmethod.disableEnable(id).then(({data}) => {
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
      // }
    }
  }
</script>
