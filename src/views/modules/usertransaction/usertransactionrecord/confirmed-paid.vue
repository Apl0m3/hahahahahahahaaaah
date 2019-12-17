<template>
  <el-dialog
    :title="$t('manage.trRecord.deliveryOrder')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-collapse v-model="activeNames">
      <el-collapse-item :title="$t('manage.trRecord.orderDetails.title1')" name="0">
        <el-form :model="dataForm" ref="dataForm" label-width="100px">
          <el-form-item :label="$t('manage.trRecord.orderDetails.userName')">
            {{transaction.userName}}
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item :title="$t('manage.trRecord.orderDetails.title2')" name="1">
        <el-form ref="dataForm" label-width="100px">
          <el-form-item :label="$t('manage.trRecord.orderDetails.createTime')" prop="createTime">
            {{transaction.createTime}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.transactionId')" prop="transactionId">
            {{transaction.transactionId}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.tripartiteTransactionId')" prop="tripartiteTransactionId" v-if="transaction.tripartiteTransactionId">
            {{transaction.tripartiteTransactionId}}
          </el-form-item>
          <!-- <el-form-item label="物流单号：" prop="shipmentId" v-if="transactionLogistics!=null">
             {{transactionLogistics.logisticsId}}({{transactionLogistics.name}})
           </el-form-item>-->
          <el-form-item :label="$t('manage.trRecord.orderDetails.paymentMethodId')" prop="paymentMethodId">
            {{getPaymentMethod()}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.totalAmount')" prop="totalAmount">
            {{transaction.totalAmount|doubleFilter}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.integralDeductionAmount')" prop="integralDeductionAmount" v-if="transaction.couponAmount">
            {{transaction.couponAmount}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.rate')" prop="rate" v-if="transaction.rate">
            {{$t('manage.trRecord.orderDetails.rate')}}{{transaction.rate|doubleFilter}}% € {{transaction.rateAmount|doubleFilter}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.discount')" prop="discount" v-if="transaction.discount">
            {{$t('manage.trRecord.orderDetails.discount')}}{{transaction.discount|doubleFilter}}% € {{transaction.discountAmount|doubleFilter}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.amount')" prop="amount">
            {{transaction.amount|doubleFilter}}
          </el-form-item>

          <el-form-item :label="$t('manage.trRecord.orderDetails.status')+'：'" prop="status">
            <el-tag>{{transaction.list[0].status>=3?getStatus(transaction.list[0].status):getStatus(transaction.status)}}</el-tag>
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.remarks')" prop="remarks" v-if="transaction.remarks">
            {{transaction.remarks}}
          </el-form-item>
        </el-form>

      </el-collapse-item>
      <el-collapse-item :title="$t('manage.trRecord.orderDetails.address')" name="2" v-if="transaction.address">
        <el-form ref="dataForm" label-width="100px">
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressName')">
            {{transaction.address.name}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressPhone')">
            {{transaction.address.phone}}
          </el-form-item>
          <el-form-item label="email：" v-if="transaction.address.email">
            {{transaction.address.email}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressCountry')">
            {{transaction.address.country}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressProvinceStr')">
            {{transaction.address.provinceStr}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressCityStr')">
            {{transaction.address.cityStr}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressAddress')">
            {{transaction.address.address}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressPostalCode')">
            {{transaction.address.postalCode}}
          </el-form-item>

        </el-form>
      </el-collapse-item>
      <el-collapse-item :title="$t('manage.trRecord.orderDetails.title3')" name="3" v-if="transaction.invoice">
        <el-form ref="dataForm" label-width="100px">
          <el-form-item :label="$t('manage.trRecord.orderDetails.invoiceCompanyName')">
            {{transaction.invoice.companyName}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.invoiceName')">
            {{transaction.invoice.name}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.invoicePhone')">
            {{transaction.invoice.phone}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.invoiceTaxNum')">
            {{transaction.invoice.taxNum}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressCountry')">
            {{transaction.invoice.country}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressProvinceStr')">
            {{transaction.invoice.provinceStr}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressCityStr')">
            {{transaction.invoice.cityStr}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressAddress')">
            {{transaction.invoice.address}}
          </el-form-item>
          <el-form-item :label="$t('manage.trRecord.orderDetails.addressPostalCode')">
            {{transaction.invoice.postalCode}}
          </el-form-item>

        </el-form>
      </el-collapse-item>
      <el-collapse-item :title="$t('manage.trRecord.orderDetails.title4')" name="4">
        <el-table
          :data="transaction.list"
          stripe
          style="width: 100%">
          <el-table-column
            prop="image"
            :label="$t('manage.trRecord.confirmedPaidVue.commodityInfo')"
            width="120">
            <template slot-scope="scope">
              <p> <img :src="global.showUrl+scope.row.image" width="100px" height="100px"></p>
              <p>{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            :label="$t('manage.trRecord.orderDetails.commodityNum')">
            <template slot-scope="scope">
              <p v-if="transaction.type===2">{{scope.row.commodityNum}}</p>
              <p v-if="transaction.type===1&&scope.row.numberSelectType===1">
                {{scope.row.commodityNum}}</p>
              <p v-if="transaction.type===1&&scope.row.numberSelectType===2">
                {{scope.row.ladderNum.num}}</p>
              <p v-if="transaction.type===1&&scope.row.numberSelectType===3&&item.num>0" v-for="item in scope.row.numberAttributes">
                {{item.name}} - {{item.num}}</p>
              <!--<p v-if="transaction.type==2">{{scope.row.commodityNum}}</p>-->
              <!--<p v-if="transaction.type==1">-->
                <!--{{(scope.row.numberSelectType==3||scope.row.numberSelectType==1)?scope.row.commodityNum:scope.row.ladderNum.num}}</p>-->
            </template>
          </el-table-column>

          <el-table-column
            prop="amount"
            :label="$t('manage.trRecord.orderDetails.attribute')" v-if="transaction.type==1">
            <template slot-scope="scope">
              <p v-if="transaction.type==1" v-for="item in scope.row.attribute">
                <span>{{item.name}}:</span>
                <span v-if="item.type===1"> {{item.inputValue}}</span>
                <span v-if="item.selectType==0">{{item.valueName}}<span v-if="item.category==2">{{item.valueLength}}×{{item.valueWidth}}</span></span>
                <span v-else-if="item.selectType==1"><img :src="global.showUrl+item.valueUrl"
                                                          style="width: 50px;height: 50px;"><span v-if="item.category==2">{{item.valueLength}}×{{item.valueWidth}}</span></span>
                <span v-else>{{item.valueName}} <img :src="global.showUrl+item.valueUrl"
                                                     style="width: 50px;height: 50px;"><span v-if="item.category==2">{{item.valueLength}}×{{item.valueWidth}}</span></span>
                <!--<span v-if="item.selectType==0">{{item.valueName}}</span>-->
                <!--<span v-else-if="item.selectType==1"><img :src="global.showUrl+item.valueUrl"-->
                                                          <!--style="width: 50px;height: 50px;"></span>-->
                <!--<span v-else>{{item.valueName}} <img :src="global.showUrl+item.valueUrl"-->
                                                     <!--style="width: 50px;height: 50px;"></span>-->
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            :label="$t('manage.trRecord.orderDetails.expectTime')" v-if="transaction.type==1">
            <template slot-scope="scope">
              <p>{{scope.row.expectTime}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="size"
            :label="$t('manage.trRecord.orderDetails.status')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status>3&&scope.row.status!=4&&scope.row.status!=5&&scope.row.status!=6&&scope.row.status!=10">{{getStatus(scope.row.status)}}</el-tag>
              <el-tag v-if="transaction.status<=3&&scope.row.status<=3">{{getStatus(transaction.status)}}</el-tag>
              <el-tag v-if="scope.row.substate">{{getSubstate(scope.row.status,scope.row.substate,scope.row.transactionServiceType)}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" :disabled="repeatClick" @click="updateClick(1)">{{$t('manage.trRecord.confirmedPaidVue.uncollected')}}</el-button>
      <el-button type="primary" :disabled="repeatClick" @click="updateClick(2)">{{$t('manage.trRecord.confirmedPaidVue.collected')}}</el-button>
    </span>
  </el-dialog>


</template>

<script>
  import {usertransactionrecord} from '@/action/usertransactionrecord'
  import Delivery from './delivery'

  export default {
    data() {
      return {
        visible: false,
        deliveryShow: false,
        repeatClick: false,
        transaction: {},
        activeNames: ['0', '1'],
        dataForm: {}
      }
    },
    components: {
      Delivery
    },
    methods: {
      init(id) {
        this.transaction.id = id || 0;
        this.visible = true;
        this.repeatClick = false;
        this.$nextTick(() => {
          if (this.transaction.id) {
            usertransactionrecord.info(this.transaction.id).then(({data}) => {
              if (data && data.code === 200) {
                this.transaction = data.map;
              }
            })
          }
        })
      },
      getPaymentMethod() {
        let paymentMethodId = this.transaction.paymentMethodId;
        let type = this.transaction.type;
        if (paymentMethodId === 1)
          return this.$t('manage.trRecord.form.payType_bank');
        else if (paymentMethodId === 2)
          return this.$t('manage.trRecord.form.payType_visa');
        else if (type === 2)
          return this.$t('manage.trRecord.form.payType_integral')
      },
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
        else if (status == 11)
          return this.$t('manage.trRecord.form.trType_11');
      },
      updateClick(type) {
        this.repeatClick=true;
        usertransactionrecord.updateStatus({transactionId: this.transaction.transactionId, type: type}).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible=false;
                this.repeatClick=false;
                this.$emit('refreshDataList');
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },

    }
  }
</script>
<style scoped>
  .el-form {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-flow: wrap
  }

  >>> .el-form-item {
    width: 50%;
  }
</style>
