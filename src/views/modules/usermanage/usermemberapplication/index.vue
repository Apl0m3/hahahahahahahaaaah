<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select
          v-model="dataForm.userId"
          filterable
          clearable
          remote
          :placeholder="$t('manage.usermanage.userAgent.mail')"
          reserve-keyword
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
        <!--<el-button v-if="isAuth('user:usermemberapplication:save')" type="primary" @click="addOrUpdateHandle()">新增
        </el-button>
        <el-button v-if="isAuth('user:usermemberapplication:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.name')">
      </el-table-column>
      <el-table-column
        prop="mail"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.mail')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.createTime')">
      </el-table-column>
      <el-table-column
        prop="typeName"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.typeName')">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===0">{{$t('manage.usermanage.userAgent.status1')}}</el-tag>
          <el-tag v-if="scope.row.status===1">{{$t('manage.usermanage.userAgent.status2')}}</el-tag>
          <el-tag type="danger" v-if="scope.row.status===2">{{$t('manage.usermanage.userAgent.status3')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="applicationTime"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.applicationTime')">
      </el-table-column>
      <el-table-column
        prop="applicationName"
        header-align="center"
        align="center"
        :label="$t('manage.usermanage.userAgent.applicationName')">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">
            {{scope.row.status===0?$t('manage.usermanage.userAgent.check'):$t('manage.usermanage.userAgent.see')}}
          </el-button>
          <el-button type="text" v-if="scope.row.status===1" size="small" @click="setDiscount(scope.row.userId)">
            {{$t('manage.usermanage.userAgent.setDiscount')}}
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 设置折扣率-->
    <set-discount v-if="setDiscountVisible" ref="setDiscount" @refreshDataList="getDataList"></set-discount>

  </div>
</template>

<script>
  import {userMemberApplication} from '../../../../action/usermemberapplication'
  import AddOrUpdate from './add-or-update'
  import SetDiscount from './set-discount'

  export default {
    data() {
      return {
        dataForm: {
          userId: '',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        setDiscountVisible: false,
        options:[],
        loading: false,
      }

    },
    components: {
      AddOrUpdate,
      SetDiscount
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          userId: this.dataForm.userId,
        };
        userMemberApplication.list(params).then(({data}) => {
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
      remoteMethod (query) {
          this.loading = true
          if (query !== '') {
              userMemberApplication.getUser({name: query}).then(({data}) => {
                  if (data && data.code === 200) {
                      this.loading = false;
                      this.options = data.list
                  }
              })
          }
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
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      //设置折扣率
      setDiscount (id) {
        this.setDiscountVisible = true
        this.$nextTick(() => {
          this.$refs.setDiscount.getTypeList(id)
        })
      },
      // 删除
      // deleteHandle(id) {
      //   var ids = id ? [id] : this.dataListSelections.map(item => {
      //     return item.id
      //   })
      //   this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     userMemberApplication.del(ids).then(({data}) => {
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
