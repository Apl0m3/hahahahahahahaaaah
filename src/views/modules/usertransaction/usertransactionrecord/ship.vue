<template>
  <el-dialog
    :title="$t('manage.trRecord.ship.title')"
    :close-on-click-modal="false"
    :before-close="close"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item :label="$t('manage.trRecord.ship.deliveryMethodId')" prop="deliveryMethodId">
        <el-radio-group v-model="dataForm.deliveryMethodId" @change="changeDeliveryMethodId">
          <el-radio :label="1">{{$t('manage.trRecord.ship.deliveryMethodId1')}}</el-radio>
          <el-radio :label="2">{{$t('manage.trRecord.ship.deliveryMethodId2')}}</el-radio>
        </el-radio-group>
        <!--        <el-input v-model="dataForm.deliveryMethodId" placeholder="物流方式" ></el-input>-->
      </el-form-item>
      <el-form-item :label="$t('manage.trRecord.ship.logisticsId')" prop="logisticsId" v-if="dataForm.deliveryMethodId === 1">
        <el-input v-model="dataForm.logisticsId" :placeholder="$t('manage.trRecord.ship.logisticsIdPla')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.trRecord.ship.no')" prop="no" v-if="dataForm.deliveryMethodId === 1">
        <el-select
          v-model="dataForm.no"
          filterable
          :clearable="true"
          :placeholder="$t('manage.trRecord.ship.noPla')" >
          <el-option
            v-for="item in company"
            :key="item.no"
            :label="item.com"
            :value="item.no">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manage.trRecord.ship.deliveryStaffId')" prop="deliveryStaffId" v-if="dataForm.deliveryMethodId === 2">
        <el-select
          v-model="dataForm.deliveryStaffId"
          filterable
          :clearable="true"
          :placeholder="$t('manage.trRecord.ship.deliveryStaffIdPla')">
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {usertransactionrecord} from '@/action/usertransactionrecord'

  export default {
    data() {
      return {
        repeatVisible: false,
        visible: false,
        dataForm: {
          id: 0,
          logisticsId: '',
          deliveryMethodId: 1,
          deliveryStaffId: '',
          name: '',
          no: '',


        }, dataRule: {
          deliveryMethodId: [{required: true, message: this.$t('manage.trRecord.ship.deliveryMethodIdRule'), trigger: 'blur'}],
          shipmentId: [{required: true, message: this.$t('manage.trRecord.ship.shipmentIdRule'), trigger: 'blur'}],
          no: [{required: true, message: this.$t('manage.trRecord.ship.noRule'), trigger: 'blur'}],
          deliveryStaffId: [{required: true, message: this.$t('manage.trRecord.ship.deliveryStaffIdRule'), trigger: 'blur'}],
        },
        transactionLogisticsReqDto: {},
        company: [],
        loading: false,
        loadingStaff: true,
        staffList: []
      }
    },
    methods: {
      close() {
        this.visible = false;
        this.repeatVisible = false;
        this.clear();
      },
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          usertransactionrecord.getCompany().then(({data}) => {
            if (data && data.code === 200) {
              this.company = data.list;
            }
          });
          usertransactionrecord.queryDeliveryStaff().then(({data}) => {
            if (data && data.code === 200) {
              this.staffList = data.list;
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          let transactionLogistics;
          if (valid) {
            this.repeatVisible = true;
            if (this.dataForm.deliveryMethodId === 1) {
              let vm = this;
              this.company.forEach(function (item) {
                if (item.no == vm.dataForm.no) {
                  vm.dataForm.name = item.com;
                  return;
                }
              });
              transactionLogistics = {
                logisticsId: this.dataForm.logisticsId,
                name: this.dataForm.name,
                no: this.dataForm.no
              };
            }
            let params = {
              id: this.dataForm.id,
              deliveryStaffId: this.dataForm.deliveryStaffId,
              deliveryMethodId: this.dataForm.deliveryMethodId,
              transactionLogisticsReqDto: transactionLogistics

            };
            usertransactionrecord.ship(params).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit('refreshDataList');
                    this.repeatVisible = false;
                    this.clear();
                  }
                })
              } else {
                this.$message.error(data.msg);
                this.repeatVisible = false;
                this.clear();
              }
            })
          }
        })
      },
      clear() {
        this.dataForm.logisticsId = '';
        this.dataForm.deliveryMethodId = 1;
        this.dataForm.deliveryStaffId = '';
        this.dataForm.name = '';
        this.dataForm.no = ''
      },
      changeDeliveryMethodId() {
        this.$refs['dataForm'].validate((valid) => {
        });
      }
    }
  }
</script>
