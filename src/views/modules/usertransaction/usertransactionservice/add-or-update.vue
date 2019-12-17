<template>
  <el-dialog
    :title="$t('common.showDet')"
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
        <ul class="el-upload-list el-upload-list--picture-card" >
          <li v-for="item in dataForm.fileList" class="el-upload-list__item is-success" >
            <img   :src="global.showUrl+item.image" class="avatar" style="width: 100%;height: 100%">
          </li>
        </ul>
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
      <el-form-item :label="$t('manage.transactionService.returnReason')" prop="returnReason">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.returnReason" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.status')" prop="status">
        <el-radio-group :disabled="dataForm.id!==0" v-model="dataForm.status">
          <el-radio :label="0">{{$t('manage.transactionService.status1')}}</el-radio>
          <el-radio :label="1">{{$t('manage.transactionService.status2')}}</el-radio>
          <el-radio :label="2">{{$t('manage.transactionService.status3')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.applicationBy')" prop="applicationBy">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.applicationBy" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.applicationTime')" prop="applicationTime">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.applicationTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.transactionService.reason')" prop="reason">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.reason" placeholder=""></el-input>
      </el-form-item>


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">{{$t("common.close")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {transactionserviceapplication} from '@/action/transactionserviceapplication'

    export default {
        data() {
            return {
                visible: false,
                dialogImageUrl: '', // 轮播图
                dialogVisible: false, // 轮播图
                fileList: [], // 轮播图
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
                    fileList:[],
                },
                dataRule: {
                    type: [
                        {required: true, message: '售后类型  1 换货 2 退货不能为空', trigger: 'blur'}
                    ],
                    userId: [
                        {required: true, message: '申请人不能为空', trigger: 'blur'}
                    ],
                    createTime: [
                        {required: true, message: '申请时间不能为空', trigger: 'blur'}
                    ],
                    transactionCommodityId: [
                        {required: true, message: '申请退货 产品不能为空', trigger: 'blur'}
                    ],
                    returnReason: [
                        {required: true, message: '退货原因不能为空', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '状态  0 审核中  1 审核成功  2审核失败不能为空', trigger: 'blur'}
                    ],
                    applicationBy: [
                        {required: true, message: '审核人不能为空', trigger: 'blur'}
                    ],
                    applicationTime: [
                        {required: true, message: '审核时间不能为空', trigger: 'blur'}
                    ],
                    reason: [
                        {required: true, message: '审核失败原因不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            init(id) {
                this.dataForm.id = id || 0
                this.visible = true
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
                                this.dataForm.status = data.transactionServiceApplication.status
                                this.dataForm.applicationBy = data.transactionServiceApplication.applicationName
                                this.dataForm.applicationTime = data.transactionServiceApplication.applicationTime
                                this.dataForm.reason = data.transactionServiceApplication.reason
                                this.dataForm.returnExplain = data.transactionServiceApplication.returnExplain
                                let files = data.transactionServiceApplication.fileList
                                this.dataForm.fileList = data.transactionServiceApplication.fileList;

                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        var params = {
                            'id': this.dataForm.id || undefined,
                            'type': this.dataForm.type,
                            'userId': this.dataForm.userId,
                            'createTime': this.dataForm.createTime,
                            'transactionCommodityId': this.dataForm.transactionCommodityId,
                            'returnReasonId': this.dataForm.returnReasonId,
                            'status': this.dataForm.status,
                            'applicationBy': this.dataForm.applicationBy,
                            'applicationTime': this.dataForm.applicationTime,
                            'reason': this.dataForm.reason
                        }
                        var tick = !this.dataForm.id ? transactionserviceapplication.add(params) : transactionserviceapplication.update(params)
                        tick.then(({data}) => {
                            if (data && data.code === 0) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },

        }
    }
</script>
