<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.companyName" :placeholder="$t('manage.usermanage.usersupplierapplication.companyName')" clearable></el-input>
      </el-form-item>
      <el-select v-model="dataForm.status" :clearable="true" :placeholder="$t('manage.usermanage.usersupplierapplication.status')">
        <el-option :label="$t('manage.usermanage.usersupplierapplication.SubmitAudit')" :value="0">
          {{$t('manage.usermanage.usersupplierapplication.SubmitAudit')}}
        </el-option>
        <el-option :label="$t('manage.usermanage.usersupplierapplication.AuditSuccess')" :value="1">
          {{$t('manage.usermanage.usersupplierapplication.AuditSuccess')}}
        </el-option>
        <el-option :label="$t('manage.usermanage.usersupplierapplication.AuditFailure')" :value="2">
          {{$t('manage.usermanage.usersupplierapplication.AuditFailure')}}
        </el-option>
      </el-select>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
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
<!--        :label="$t('manage.usermanage.usersupplierapplication.id')">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="companyName"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.usersupplierapplication.companyName')">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.usersupplierapplication.userName')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.usersupplierapplication.createTime')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.usersupplierapplication.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="info">{{$t('manage.usermanage.usersupplierapplication.SubmitAudit')}}</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">{{$t('manage.usermanage.usersupplierapplication.AuditSuccess')}}</el-tag>
          <el-tag v-else type="danger">{{$t('manage.usermanage.usersupplierapplication.AuditFailure')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="applicationTime"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.usersupplierapplication.applicationTime')">
      </el-table-column>
      <el-table-column
        prop="applicationByName"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.usersupplierapplication.applicationByName')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('manage.usermanage.usersupplierapplication.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailHandler(scope.row)">
            {{scope.row.status === 0? $t('manage.usermanage.userdesignerapplication.auditButton'):$t('manage.usermanage.userdesignerapplication.showButton')}}
          </el-button>
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
    <!-- 详情 / 审核 -->
    <detail v-if="detailVisible" :isEdit="isEdit" ref="detail" @refreshDataList="getDataList"></detail>
  </div>
</template>

<script>
  import { usersupplierapplication } from '@/action/usersupplierapplication'
  import Detail from './detail'
  export default {
    data () {
      return {
        isEdit: '',
        dataForm: {
          companyName: '',
          status: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        detailVisible: false
      }
    },
    components: {
      Detail
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
          companyName: this.dataForm.companyName,
          status: this.dataForm.status
        }
        usersupplierapplication.list(params).then(({data}) => {
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
      // 详情
      detailHandler (row) {
        if(row.status === 1 ){
          this.isEdit = false
        }else {
          this.isEdit = true
        }
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detail.init(row.id)
        })
      }
    }
  }
</script>
