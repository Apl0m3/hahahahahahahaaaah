<template>
  <el-dialog
    :title="$t('common.approval')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item :label="$t('manage.transactionService.type')" prop="type">
        <el-radio-group :disabled="dataForm.id!==0" v-model="dataForm.type">
          <el-radio :label="1">{{$t('manage.transactionService.type1')}}</el-radio>
          <el-radio :label="2">{{$t('manage.transactionService.type2')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.returnExplain')" prop="returnExplain">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.returnExplain" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.fileImage')" prop="serviceFiles">
        <ul class="el-upload-list el-upload-list--picture-card">
          <li v-for="item in dataForm.fileList" class="el-upload-list__item is-success">
            <img :src="global.showUrl+item.image" class="avatar" style="width: 100%;height: 100%">
          </li>
        </ul>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.returnReason')" prop="returnReason">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.returnReason" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.userName')" prop="userId">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.userId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.createTime')" prop="createTime">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.commodityName')" prop="transactionCommodityId">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.transactionCommodityId" placeholder=""></el-input>
      </el-form-item>

      <el-form-item :label="$t('manage.transactionService.status')" prop="status">
        <el-select :placeholder="$t('manage.transactionService.statusPlaceHolder')" v-model="dataForm.status"
        >
          <el-option-group>
            <el-option :value="1" :label="$t('manage.transactionService.status2')">
              {{$t('manage.transactionService.status2')}}
            </el-option>
            <el-option :value="2" :label="$t('manage.transactionService.status3')">
              {{$t('manage.transactionService.status3')}}
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>


      <!--      <el-form-item :label="$t('manage.transactionService.applicationBy')" prop="applicationBy">-->
      <!--        <el-input :disabled="dataForm.id!==0" v-model="dataForm.applicationBy" placeholder=""></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item :label="$t('manage.transactionService.applicationTime')" prop="applicationTime">-->
      <!--        <el-input :disabled="dataForm.id!==0" v-model="dataForm.applicationTime" placeholder=""></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item v-if="dataForm.status ===2" :label="$t('manage.transactionService.reason')" prop="reason">
        <el-input v-model="dataForm.reason" placeholder=""></el-input>
      </el-form-item>


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" :disabled="replaceClick" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {transactionserviceapplication} from '@/action/transactionserviceapplication'

    export default {
        data() {
            return {
                visible: false,
               replaceClick: false,
                dataForm: {
                    id: 0,
                    type: '',
                    userId: '',
                    createTime: '',
                    transactionCommodityId: '',
                    // transaction_commodity_id
                    returnReason: '',
                    status: '',
                    applicationBy: '',
                    applicationTime: '',
                    reason: '',
                    returnExplain: '',
                    fileList: [],
                },
                dataRule: {

                    status: [
                        {required: true, message: this.$t('manage.transactionService.statusRule'), trigger: 'blur'}
                    ],
                    reason: [
                        {required: true, message: this.$t('manage.transactionService.reasonRule'), trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            init(id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.replaceClick = false
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.id) {
                        transactionserviceapplication.info(this.dataForm.id).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.type = data.transactionServiceApplication.type
                                this.dataForm.userId = data.transactionServiceApplication.userName
                                this.dataForm.createTime = data.transactionServiceApplication.createTime
                                this.dataForm.transactionCommodityId = data.transactionServiceApplication.commodityName
                                this.dataForm.returnReason = data.transactionServiceApplication.returnReason
                                this.dataForm.status = data.transactionServiceApplication.status === 0 ? '' : '';
                                this.dataForm.applicationBy = data.transactionServiceApplication.applicationName
                                this.dataForm.applicationTime = data.transactionServiceApplication.applicationTime
                                this.dataForm.reason = data.transactionServiceApplication.reason
                                this.dataForm.returnExplain = data.transactionServiceApplication.returnExplain;
                                this.dataForm.fileList = data.transactionServiceApplication.fileList;
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
              this.replaceClick = true
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                      let params = {
                        'id': this.dataForm.id || undefined,
                        'status': this.dataForm.status,
                        'reason': this.dataForm.reason
                      };

                      let tick = !this.dataForm.id ? transactionserviceapplication.add(params) : transactionserviceapplication.update(params);
                      tick.then(({data}) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: this.$t('common.success'),
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false;
                                        this.replaceClick =false;
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.replaceClick =false
                                this.$message.error(data.msg)
                            }
                        })
                    }else {
                        this.replaceClick =false
                    }
                })
            }
        }
    }
</script>
