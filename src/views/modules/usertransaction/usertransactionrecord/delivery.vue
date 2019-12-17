<template>
  <el-dialog
    width="80%"
    :title="paramsFrom.type==1?$t('manage.trRecord.delivery.title1'):$t('manage.trRecord.delivery.title2')"
    :visible.sync="innerVisible"
    append-to-body>
    <el-form :inline="true" :model="paramsFrom" @keyup.enter.native="getDataList()">
      <el-form-item style="width: auto">
        <el-input v-model.trim="paramsFrom.key" type="email" :placeholder="$t('manage.trRecord.delivery.key')" clearable></el-input>
      </el-form-item>
      <el-form-item style="width: auto" v-if="paramsFrom.type==1">
        <el-input v-model.trim="paramsFrom.start" type="number" :placeholder="$t('manage.trRecord.delivery.start')"
                  clearable></el-input>
      </el-form-item>
      <el-form-item style="width: auto" v-if="paramsFrom.type==1">
        <el-input v-model.trim="paramsFrom.end" type="number" :placeholder="$t('manage.trRecord.delivery.end')"
                  clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
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
        :label="$t('manage.trRecord.userName')">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.name')">
      </el-table-column>
      <el-table-column
        prop="avatar"
        header-align="center"
        align="center"
        :label="$t('manage.user.avatar')">
        <template slot-scope="scope">
          <img :src="global.showUrl+scope.row.avatar" v-if="scope.row.avatar" style="width: 50px;height: 50px">
          <img style="width: 50px;height: 50px" src="../../../../../static/img/head.png"  v-else>
        </template>
      </el-table-column>
      <!--      <el-table-column
              prop="commission"
              header-align="center"
              align="center"
              label="佣金" v-if="paramsFrom.type==1">
              <template slot-scope="scope">
                <p v-if="scope.row.commission">€ {{scope.row.commission|doubleFilter}}</p>
              </template>
            </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deliveryClick(scope.row)">
            {{$t('manage.trRecord.deliveryOrder')}}
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
  </el-dialog>
</template>

<script>
  import {usertransactionrecord} from "../../../../action/usertransactionrecord";

  export default {
    name: "delivery",
    data() {
      return {
        innerVisible: false,
        dataListLoading: false,
        paramsFrom: {
          transactionCommodityId: 0,
          start: null,
          end: null,
          key: '',
          type: 1
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
      }
    },
    methods: {
      init(id, type) {
        this.paramsFrom.transactionCommodityId = id || 0;
        this.paramsFrom.type = type || 1;
        this.innerVisible = true;

        this.$nextTick(() => {
          this.getDataList()
          // this.$refs['dataForm'].resetFields()
          /*    if (this.transaction.id) {
                usertransactionrecord.info(this.transaction.id).then(({data}) => {
                  //
                  if (data && data.code === 200) {
                    console.log(data)
                    this.transaction = data.map;

                  }
                })
              }*/
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true;
        this.paramsFrom.page = this.pageIndex;
        this.paramsFrom.pageSize = this.pageSize;
        usertransactionrecord.queryDelivery(this.paramsFrom).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.$message.error(data.msg)
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val;
        this.pageIndex = 1;
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      deliveryClick(row) {
        let reminder = this.$t('manage.trRecord.confirmedDeliver');
        reminder = reminder.replace("name", row.name);
        this.$confirm(reminder, this.$t('manage.trRecord.validate.tips'), {
          confirmButtonText: this.$t('common.comfirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          let params = {
            transactionCommodityId: this.paramsFrom.transactionCommodityId,
            type: this.paramsFrom.type,
            userId: row.id
          };
          usertransactionrecord.delivery(params).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.innerVisible = false;
                  this.$emit('refreshDataList')
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

<style scoped>

</style>
