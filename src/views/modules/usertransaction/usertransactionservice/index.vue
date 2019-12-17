<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select :placeholder="$t('manage.transactionService.statusPlaceHolder')" v-model="dataForm.status"
                   :clearable="true">
          <el-option-group>
            <el-option :value="0" :label="$t('manage.transactionService.status1')">
              {{$t('manage.transactionService.status1')}}
            </el-option>
            <el-option :value="1" :label="$t('manage.transactionService.status2')">
             {{$t('manage.transactionService.status2')}}
            </el-option>
            <el-option :value="2" :label="$t('manage.transactionService.status3')">
              {{$t('manage.transactionService.status3')}}
            </el-option>
          </el-option-group>
        </el-select>
        <el-select :placeholder="$t('manage.transactionService.typePlaceHolder')" v-model="dataForm.type"
                   :clearable="true">
          <el-option-group>
            <el-option :value="1" :label="$t('manage.transactionService.type1')">
              {{$t('manage.transactionService.type1')}}
            </el-option>
            <el-option :value="2" :label="$t('manage.transactionService.type2')">
              {{$t('manage.transactionService.type2')}}
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
<!--        <el-button v-if="isAuth('usertransaction:transactionserviceapplication:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
<!--        <el-button v-if="isAuth('usertransaction:transactionserviceapplication:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">

      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        :label="$t('manage.transactionService.userName')">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.transactionService.name')">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        :label="$t('manage.transactionService.type')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===1">{{$t('manage.transactionService.type1')}}</el-tag>
          <el-tag v-if="scope.row.type===2">{{$t('manage.transactionService.type2')}}</el-tag>
        </template>
      </el-table-column>

<!--      <el-table-column-->
<!--        prop="createTime"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="申请时间">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="commodityName"
        header-align="center"
        align="center"
        :label="$t('manage.transactionService.commodityName')">
      </el-table-column>
      <el-table-column
        prop="transactionId"
        header-align="center"
        align="center"
        :label="$t('manage.transactionService.transactionId')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('manage.transactionService.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0"> {{$t('manage.transactionService.status1')}}</el-tag>
          <el-tag v-if="scope.row.status===1"> {{$t('manage.transactionService.status2')}}</el-tag>
          <el-tag v-if="scope.row.status===2"> {{$t('manage.transactionService.status3')}}</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="applicationBy"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="审核人">-->
<!--      </el-table-column>-->
      <el-table-column
          prop="applicationTime"
          header-align="center"
          align="center"
          :label="$t('manage.transactionService.applicationTime')">
        <template slot-scope="scope">
          <span v-if="scope.row.applicationTime != null">{{scope.row.applicationTime}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="reason"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="审核失败原因">-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!==0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('common.showDet')}}</el-button>
          <el-button v-if="scope.row.status===0" type="text" size="small" @click="approval(scope.row.id)">{{$t('manage.transactionService.approval')}}</el-button>
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
    <approval_component v-if="approvalVisible" ref="approvalComponent" @refreshDataList="getDataList"></approval_component>
  </div>
</template>

<script>
  import {transactionserviceapplication} from '@/action/transactionserviceapplication'
  import AddOrUpdate from './add-or-update'
  import approval_component from "./approval_component";
  export default {
    data () {
      return {

        dataForm: {
          status: '',
          type:'',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
          approvalVisible: false,
      }
    },
    components: {
      AddOrUpdate,
        approval_component
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
          status: this.dataForm.status,
          type:this.dataForm.type,
        }
        transactionserviceapplication.list(params).then(({data}) => {
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
        //审核
        approval(id){
            this.approvalVisible = true
            this.$nextTick(() => {
                this.$refs.approvalComponent.init(id)
            })
        },
      // 删除
      // deleteHandle (id) {
      //   var ids = id
      //   this.$confirm(`确定对[id=${ids}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     transactionserviceapplication.del(ids).then(({data}) => {
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
