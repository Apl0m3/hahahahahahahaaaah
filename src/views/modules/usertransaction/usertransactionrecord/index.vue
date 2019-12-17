<template>
  <div class="mod-config">
    <el-tag>{{$t('manage.trRecord.form.monthlySales')}}{{monthlySales|doubleFilter}}</el-tag>
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.transactionId" :placeholder="$t('manage.trRecord.form.writeTrId')"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.phone" :placeholder="$t('manage.trRecord.form.writePhone')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.designName" :placeholder="$t('manage.trRecord.form.designName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.supplyName" :placeholder="$t('manage.trRecord.form.supplyName')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" :clearable="true" :placeholder="$t('manage.trRecord.form.selectTrType')">
          <!--0 未支付-->
          <el-option :value="0" :label="$t('manage.trRecord.form.trType_0')"></el-option>
          <!--1 已取消订单-->
          <el-option :value="1" :label="$t('manage.trRecord.form.trType_1')"></el-option>
          <!--2 已支付-->
          <el-option :value="2" :label="$t('manage.trRecord.form.trType_2')"></el-option>
          <!--3 确认收款-->
          <el-option :value="3" :label="$t('manage.trRecord.form.trType_3')"></el-option>
          <!--4 派送设计师-->
          <el-option :value="4" :label="$t('manage.trRecord.form.trType_4')"></el-option>
          <!--5 平台审核稿件-->
          <el-option :value="5" :label="$t('manage.trRecord.form.trType_5')"></el-option>
          <!--6 指定供应商-->
          <el-option :value="6" :label="$t('manage.trRecord.form.trType_6')"></el-option>
          <!--7 确认收货-->
          <el-option :value="7" :label="$t('manage.trRecord.form.trType_7')"></el-option>
          <!--8 已评价-->
          <el-option :value="8" :label="$t('manage.trRecord.form.trType_8')"></el-option>
          <!--9 已评价-->
          <el-option :value="9" :label="$t('manage.trRecord.form.trType_9')"></el-option>
          <!--10 未支付-->
          <el-option :value="10" :label="$t('manage.trRecord.form.trType_10')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.paymentMethodId" :clearable="true"
                   :placeholder="$t('manage.trRecord.form.payType')">
          <el-option :value="1" :label="$t('manage.trRecord.form.payType_bank')"></el-option>
          <el-option :value="2" :label="$t('manage.trRecord.form.payType_visa')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.recordType" :clearable="true"
                   :placeholder="$t('manage.trRecord.form.recordType')">
          <el-option :value="1" :label="$t('manage.trRecord.form.recordType1')"></el-option>
          <el-option :value="2" :label="$t('manage.trRecord.form.recordType2')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dataForm.period"
          type="datetimerange"
          :picker-options="pickerOptions"
          :range-separator="$t('manage.trRecord.form.separator')"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="$t('manage.trRecord.form.start_date')"
          :end-placeholder="$t('manage.trRecord.form.end_date')"
          align="right">
        </el-date-picker>
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
      width="100%"
      max-height="800"
      style="font-size :12px;"
    >
      <el-table-column
        prop="transactionId"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.transactionId')">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.userName')">
        <template slot-scope="scope">
          <p>{{scope.row.userName}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentMethodId"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.form.payType')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==2">{{$t('manage.trRecord.form.payType_integral')}}</el-tag>
          <el-tag v-if="scope.row.paymentMethodId==1">{{$t('manage.trRecord.form.payType_bank')}}</el-tag>
          <el-tag v-if="scope.row.paymentMethodId==2">{{$t('manage.trRecord.form.payType_visa')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.type')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1">{{$t('manage.trRecord.form.type_ordinary')}}</el-tag>
          <el-tag v-if="scope.row.type==2">{{$t('manage.trRecord.form.type_integral')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.amount')">
        <template slot-scope="scope">
          <div v-if="scope.row.type==1">
            <p>{{$t('manage.trRecord.totalAmount')}}:€ {{scope.row.totalAmount|doubleFilter}}</p>
            <p v-if="scope.row.couponAmount">{{$t('manage.trRecord.couponAmount')}}:€
              {{scope.row.couponAmount|doubleFilter}}</p>
            <p v-if="scope.row.rate">{{$t('manage.trRecord.rate')}}:{{scope.row.rate|doubleFilter}}% €{{scope.row.rateAmount|doubleFilter}}</p>
            <p v-if="scope.row.discount">{{$t('manage.trRecord.discount')}}: {{scope.row.discount|doubleFilter}}% €
              {{scope.row.discountAmount|doubleFilter}}</p>
            <p>{{$t('manage.trRecord.amount')}}:€ {{scope.row.amount|doubleFilter}}</p>
          </div>
          <p v-if="scope.row.type==2">{{$t('manage.trRecord.integral')}}: {{scope.row.amount}}</p>
        </template>
      </el-table-column>
      <!--<el-table-column
        prop="status"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.form.selectTrType')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">{{$t('manage.trRecord.form.trType_0')}}</el-tag>
          <el-tag v-if="scope.row.status == 1">{{$t('manage.trRecord.form.trType_1')}}</el-tag>
          <el-tag v-if="scope.row.status == 2">{{$t('manage.trRecord.form.trType_2')}}</el-tag>
          <el-tag v-if="scope.row.status == 3">{{$t('manage.trRecord.form.trType_3')}}</el-tag>
          <el-tag v-if="scope.row.status == 4">{{$t('manage.trRecord.form.trType_4')}}</el-tag>
          <el-tag v-if="scope.row.status == 5">{{$t('manage.trRecord.form.trType_5')}}</el-tag>
          <el-tag v-if="scope.row.status == 6">{{$t('manage.trRecord.form.trType_6')}}</el-tag>
          <el-tag v-if="scope.row.status == 7">{{$t('manage.trRecord.form.trType_7')}}</el-tag>
          <el-tag v-if="scope.row.status == 8">{{$t('manage.trRecord.form.trType_8')}}</el-tag>
          <el-tag v-if="scope.row.status == 9">{{$t('manage.trRecord.form.trType_9')}}</el-tag>
          <el-tag v-if="scope.row.status == 10">{{$t('manage.trRecord.form.trType_10')}}</el-tag>
          <el-tag v-if="scope.row.status == 11">{{$t('manage.trRecord.form.trType_11')}}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.trRecord.createTime')">
      </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('manage.trRecord.form.commodityImage')">
          <template slot-scope="scope">
            <p><img :src="global.showUrl+scope.row.commodityImage" width="60px" height="60px"></p>
            <p>{{scope.row.commodityName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          :label="$t('manage.trRecord.form.selectTrType')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.branchStatus!=4&&scope.row.branchStatus!=5&&scope.row.branchStatus!=6&&scope.row.branchStatus!=10">{{scope.row.branchStatus<3?getStatus(scope.row.status):getStatus(scope.row.branchStatus)}}</el-tag>
            <el-tag v-if="scope.row.substate">{{getSubstate(scope.row.branchStatus,scope.row.substate,scope.row.transactionServiceType)}}</el-tag>
            <!--  <el-tag v-if="scope.row.status == 0">{{$t('manage.trRecord.form.trType_0')}}</el-tag>
              <el-tag v-if="scope.row.status == 1">{{$t('manage.trRecord.form.trType_1')}}</el-tag>
              <el-tag v-if="scope.row.status == 2">{{$t('manage.trRecord.form.trType_2')}}</el-tag>
              <el-tag v-if="scope.row.status == 3">{{$t('manage.trRecord.form.trType_3')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 4">{{$t('manage.trRecord.form.trType_4')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 5">{{$t('manage.trRecord.form.trType_5')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 6">{{$t('manage.trRecord.form.trType_6')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 7">{{$t('manage.trRecord.form.trType_7')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 8">{{$t('manage.trRecord.form.trType_8')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 9">{{$t('manage.trRecord.form.trType_9')}}</el-tag>
              <el-tag v-if="scope.row.branchStatus == 10">{{$t('manage.trRecord.form.trType_10')}}</el-tag>-->
          </template>
        </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Details(scope.row.id)">{{$t('manage.trRecord.detail')}}
          </el-button>
          <el-button type="text" size="small" @click="confirmedPaidHandle(scope.row.id)" v-if="scope.row.status ==2">
            {{$t('manage.trRecord.confirmedPaid')}}
          </el-button>
          <el-button type="text" size="small" @click="deliveryOrderHandle(scope.row.id)"
                     v-if="scope.row.status ==3 && scope.row.branchStatus<7">
            {{$t('manage.trRecord.deliveryOrder')}}
          </el-button>
          <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
    <!-- 弹窗, 新增 / 修改 -->
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
    <order-details v-if="detailsShow" ref="orderDetails" @refreshDataList="getDataList"></order-details>
    <delivery-order v-if="deliveryOrderVisible" ref="deliveryOrder" @refreshDataList="getDataList"></delivery-order>
    <confirmed-paid v-if="confirmedPaidVisible" ref="confirmedPaid" @refreshDataList="getDataList"></confirmed-paid>
    <ship v-if="shipShow" ref="ship" @refreshDataList="getDataList"></ship>
  </div>
</template>

<script>
  import {usertransactionrecord} from '@/action/usertransactionrecord'
  import AddOrUpdate from './add-or-update'
  import OrderDetails from './order_details'
  import DeliveryOrder from './delivery-order'
  import ConfirmedPaid from './confirmed-paid'
  import Ship from './ship'

  export default {
    data() {
      return {
        dataForm: {
          phone: '',
          designName: undefined,
          supplyName: undefined,
          status: null,
          period: [],
          transactionId: null,
          recordType: '',
          paymentMethodId: '',
        },
        monthlySales: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        detailsShow: false,
        shipShow: false,
        addOrUpdateVisible: false,
        deliveryOrderVisible: false,
        confirmedPaidVisible: false,
        pickerOptions: {
          shortcuts: [{
            text: this.$t('manage.user.dataPickerOptions.text1'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: this.$t('manage.user.dataPickerOptions.text2'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: this.$t('manage.user.dataPickerOptions.text3'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        column_row_offset: {
          transactionId: 1,
          userName: 1,
          paymentMethodId: 1,
          amount: 1,
          amount3: 1
        },
        now_col_row_num: {},
        now_col_offset: {},
      }
    },
    components: {
      AddOrUpdate,
      OrderDetails,
      Ship,
      DeliveryOrder,
      ConfirmedPaid,
    },
    activated() {
      this.getDataList()
      this.querymonthlySales()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        if (!this.checkPhone()) {
          this.$message.error(this.$t('manage.trRecord.validate.correctPhone'));
          return;
        }
        this.dataListLoading = true
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          phone: this.dataForm.phone,
          designName: this.dataForm.designName,
          supplyName: this.dataForm.supplyName,
          status: this.dataForm.status,
          startTime: this.dataForm.period.length >= 1 ? this.dataForm.period[0] : '',
          endTime: this.dataForm.period.length === 2 ? this.dataForm.period[1] : '',
          transactionId: this.dataForm.transactionId,
          deliveryMethodId: this.dataForm.deliveryMethodId,
          paymentMethodId: this.dataForm.paymentMethodId,
          recordType: this.dataForm.recordType,

        };
        usertransactionrecord.list(params).then(({data}) => {
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
      querymonthlySales() {
        usertransactionrecord.monthlySales().then(({data}) => {
          if (data && data.code === 200) {
            if (data.amount)
              this.monthlySales = data.amount;
          }
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
      // 详情
      Details(id) {
        this.detailsShow = true
        this.$nextTick(() => {
          this.$refs.orderDetails.init(id)
        })
      },// 发货
      Ship(id) {
        this.shipShow = true
        this.$nextTick(() => {
          this.$refs.ship.init(id)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        // console.log(111)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      deliveryOrderHandle(id) {
        // console.log(111)
        this.deliveryOrderVisible = true;
        this.$nextTick(() => {
          this.$refs.deliveryOrder.init(id)
        })
      }, confirmedPaidHandle(id) {
        // console.log(111)
        this.confirmedPaidVisible = true;
        this.$nextTick(() => {
          this.$refs.confirmedPaid.init(id)
        })
      },
      checkPhone() {
        let value = this.dataForm.phone;
        if (value) {
          // const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          // const reg2 = /^8[0-9]\d{9}$/ || reg2.test(value)
          if (reg.test(value)) {
            return true
          } else {
            return false;
          }
        } else {
          return true
        }
      },
      /* confirmReceipt(row) {
        /!* let reminder = this.$t('manage.trRecord.confirmedPaidReminder');
         reminder = reminder.replace("transactionId", row.transactionId);
         this.$confirm(reminder, this.$t('manage.trRecord.validate.tips'), {
           confirmButtonText: this.$t('common.yes'),
           cancelButtonText: this.$t('common.no'),
           type: 'warning'
         }).then(() => {
           // this.updateClick(row.transactionId, 2);
         }).catch(action => {
           console.log(action)
           if (action === 'cancel') {
             // this.updateClick(row.transactionId, action === 'cancel' ? 1 : 0);
           }
         });*!/
       },
       updateClick(transactionId, type) {
         usertransactionrecord.updateStatus({transactionId: transactionId, type: type}).then(({data}) => {
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
       },*/
      getStatus(status) {
        if (status == 0)
          return this.$t('manage.trRecord.form.trType_0');
        else if (status == 1)
          return this.$t('manage.trRecord.form.trType_1');
        else if (status == 2)
          return this.$t('manage.trRecord.form.trType_2');
        else if (status == 3)
          return this.$t('manage.trRecord.form.trType_3');
        else if (status == 4)
          return this.$t('manage.trRecord.form.trType_4');
        else if (status == 5)
          return this.$t('manage.trRecord.form.trType_5');
        else if (status == 6)
          return this.$t('manage.trRecord.form.trType_6');
        else if (status == 7)
          return this.$t('manage.trRecord.form.trType_7');
        else if (status == 8)
          return this.$t('manage.trRecord.form.trType_8');
        else if (status == 9)
          return this.$t('manage.trRecord.form.trType_9');
        else if (status == 10)
          return this.$t('manage.trRecord.form.trType_10');
      },
      getSubstate(status, substate,type) {
        if (status == 4)
          switch (substate) {
            case 40001:
              return this.$t('manage.trRecord.form.subState40001');
            case 40002:
              return this.$t('manage.trRecord.form.subState40002');
            case 40003:
              return this.$t('manage.trRecord.form.subState40003');
            case 40004:
              return this.$t('manage.trRecord.form.subState40004');
            case 40005:
              return this.$t('manage.trRecord.form.subState40005');
          }
        else if (status == 5)
          switch (substate) {
            case 50001:
              return this.$t('manage.trRecord.form.subState50001');
            case 50002:
              return this.$t('manage.trRecord.form.subState50002');
            case 50003:
              return this.$t('manage.trRecord.form.subState50003');
          }
        else if (status == 6)
          switch (substate) {
            case 60001:
              return this.$t('manage.trRecord.form.subState60001');
            case 60002:
              return this.$t('manage.trRecord.form.subState60002');
            case 60003:
              return this.$t('manage.trRecord.form.subState60003');
          }
        else if (status == 10 && (type && type == 1)) {
          switch (substate) {
          case 100001:
            return this.$t('manage.trRecord.form.subState100001');
          case 100002:
            return this.$t('manage.trRecord.form.subState100002');
          case 100003:
            return this.$t('manage.trRecord.form.subState100003');
          case 100004:
            return this.$t('manage.trRecord.form.subState100004');
          case 100005:
            return this.$t('manage.trRecord.form.subState100005');
          case 100006:
            return this.$t('manage.trRecord.form.subState100006');
          case 100007:
            return this.$t('manage.trRecord.form.subState100007');
        }}else if(status == 10 && (type && type == 2)){
          switch (substate) {
            case 100001:
              return this.$t('manage.trRecord.form.subState100001');
            case 100002:
              return this.$t('manage.trRecord.form.subState100002');
            case 100003:
              return this.$t('manage.trRecord.form.subState100003');
            case 100004:
              return this.$t('manage.trRecord.form.subState100004');
            case 100007:
              return this.$t('manage.trRecord.form.subState100007');
          }
        }
      },


    }
  }
</script>
