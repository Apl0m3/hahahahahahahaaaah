<template>
  <el-dialog
    :title="$t('manage.statistics.design.title')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('manage.statistics.design.operate.walletInformation')" name="0">
        <el-form :model="dataForm" ref="dataForm" label-width="100px">
          <el-form-item :label="$t('manage.statistics.design.operate.unSettlementMoney')">
            {{userAccount.amount|doubleFilter}}
          </el-form-item>
          <el-form-item :label="$t('manage.statistics.design.operate.totalMoney')">
            {{userAccount.totalAmount|doubleFilter}}
          </el-form-item>
          <el-form-item :label="$t('manage.statistics.design.operate.settlementMoney')">
            {{userAccount.settlementAmount|doubleFilter}}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item :title="$t('manage.statistics.design.operate.bankAccountInfo')" name="1">
        <el-form ref="dataForm" label-width="100px">
          <el-form-item :label="$t('manage.statistics.design.operate.bankAccount')" prop="bankAccount">
            {{userBank.bankAccount}}
          </el-form-item>
          <el-form-item :label="$t('manage.statistics.design.operate.bankName')" prop="bankName">
            {{userBank.bankName}}
          </el-form-item>
          <el-form-item :label="$t('manage.statistics.design.operate.bankUserName')" prop="bankUserName">
            {{userBank.bankUserName}}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item v-if="totalPage1>0" :title="$t('manage.statistics.design.operate.settledCommission')" name="2">
        <el-table
          :data="settledList"
          border
          v-loading="dataListLoading1"
          @selection-change="selectionChangeHandle"
          style="width: 100%;">
          <el-table-column
            prop="image"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.operate.info')">
            <template slot-scope="scope">
              <img :src="global.showUrl+scope.row.image" style="width: 40px;height: 40px;">
              <p>{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="commodityTypeName"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.operate.commodityType')">
          </el-table-column>
          <el-table-column
            prop="transactionId"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.operate.transactionId')">
          </el-table-column>
          <el-table-column
            prop="amount"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.commission')">
            <template slot-scope="scope">
              {{scope.row.amount|doubleFilter}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle1"
          @current-change="currentChangeHandle1"
          :current-page="pageIndex1"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize1"
          :total="totalPage1"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-collapse-item>
      <el-collapse-item v-if="totalPage>0" :title="$t('manage.statistics.design.operate.unsettledCommission')" name="3">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          style="width: 100%;">
          <el-table-column
            prop="image"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.operate.info')">
            <template slot-scope="scope">
              <img :src="global.showUrl+scope.row.image" style="width: 40px;height: 40px;">
              <p>{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="commodityTypeName"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.operate.commodityType')">
          </el-table-column>
          <el-table-column
            prop="transactionId"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.operate.transactionId')">
          </el-table-column>
          <el-table-column
            prop="amount"
            header-align="center"
            align="center"
            :label="$t('manage.statistics.design.commission')">
            <template slot-scope="scope">
              {{scope.row.amount|doubleFilter}}
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
      </el-collapse-item>
    </el-collapse>
    <span slot="footer" class="dialog-footer">
      <el-button @click="settlementSub()" v-if="userAccount.amount>0" type="primary">{{$t('manage.statistics.design.settlement')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {userAccount} from "../../../../action/userAccount";

  export default {
    data() {
      return {
        activeNames: ['0', '1'],
        visible: false,
        userBank: {},
        userAccount: {},
        type: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        pageIndex1: 1,
        pageSize1: 10,
        dataListLoading1: false,
        totalPage1: 0,
        dataList: [],
        settledList: [],
        dataForm: {
          id: 0,
          userId: '',
          commodityTypeId: '',
          commission: '',
          createBy: '',
          createTime: '',
          updateBy: '',
          updateTime: ''
        },
        dataRule: {
          userId: [
            {required: true, message: this.$t('manage.statistics.design.dataRule.userId'), trigger: 'blur'}
          ],
          commodityTypeId: [
            {required: true, message: this.$t('manage.statistics.design.dataRule.commodityTypeId'), trigger: 'blur'}
          ],
          commission: [
            {required: true, message: this.$t('manage.statistics.design.dataRule.commission'), trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      init(id, type) {
        this.type = type;
        this.dataForm.id = id || 0;
        this.visible = true;
        this.$nextTick(() => {
          this.dataList=[];
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            userAccount.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.userAccount = data.userAccount
                this.userBank = data.bank
                this.getDataList()
                this.getSettledDeliveryList()
              }
            })
          }
        })
      },
      settlementSub() {
        let amount = this.userAccount.amount;
          let message = this.$t('manage.statistics.design.operate.message');
          message = message.replace("amount", amount)
        this.$confirm(message, this.$t('common.tips'), {
          confirmButtonText: this.$t("common.comfirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: 'warning'
        }).then(() => {
          let params = {id: this.userAccount.id, amount: this.userAccount.amount};
          userAccount.settlement(params).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t('common.success'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true;
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          type: this.type,
          userId: this.userAccount.userId,
        };
        userAccount.deliveryList(params).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.list;
            this.totalPage = data.page.totalCount;
          } else {
            this.dataList = [];
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 获取已结算数据列表
      getSettledDeliveryList () {
        this.dataListLoading1 = true
        let params = {
          page: this.pageIndex1,
          limit: this.pageSize1,
          type: this.type,
          userId: this.userAccount.userId
        }
        userAccount.settledDeliveryList(params).then(({data}) => {
          if (data && data.code === 200) {
            this.settledList = data.page.list
            this.totalPage1 = data.page.totalCount
          } else {
            this.settledList = []
            this.totalPage1 = 0
          }
          this.dataListLoading1 = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val;
        this.pageIndex = 1;
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle1(val) {
        this.pageSize1 = val;
        this.pageIndex1 = 1;
        this.getSettledDeliveryList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 当前页
      currentChangeHandle1(val) {
        this.pageIndex1 = val
        this.getSettledDeliveryList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // // 多选
      // selectionChangeHandle1(val) {
      //   this.dataListSelections1 = val
      // },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.type)
        })
      },
    }
  }
</script>
