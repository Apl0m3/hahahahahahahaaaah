<template>
  <el-dialog
    :title="!dataForm.id ? $t('common.add') : $t('common.update')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="130px">
      <el-form-item :label="$t('manage.operation.payment.name')" prop="name">
        <el-input v-model="dataForm.name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.operation.payment.image')"  prop="image">
        <el-upload
          class="avatar-uploader"
          :action="this.global.uploadUrl"
          :show-file-list="false"
          accept="image/jpeg,image/gif,image/png"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- <el-input v-model="dataForm.image" placeholder=""></el-input>-->
      </el-form-item>

      <el-form-item :label="$t('manage.operation.payment.bankAccount')" prop="key" v-if="typeId" >
        <el-input v-model="dataForm.key" placeholder=""></el-input>
      </el-form-item>
    <!--  <el-form-item :label="$t('manage.operation.payment.status')" prop="status" v-if="typeId">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">{{$t('manage.operation.payment.status1')}}</el-radio>
          <el-radio :label="1">{{$t('manage.operation.payment.status2')}}</el-radio>
        </el-radio-group>
      </el-form-item>-->


    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {paymentmethod} from '@/action/paymentmethod'

  export default {
    props: {
      typeId: {
        type: Boolean,
      }
    },
    data () {
      var checkNum = (rule, value, callback) => {
        value=value.replace(/\s*/g, '')
        let double = /^[A-Za-z0-9]{1,30}$/
        if (!double.test(value)) {
          return callback(new Error(this.$t('manage.operation.payment.rule.keyRule')))
        } else {
          callback()
        }
      }
      return {
        imageUrl: '',
        importFileUrl: '', // 在初始时指定url地址即可
        visible: false,
        wxShow: true,
        dataForm: {
          id: 0,
          name: '',
          image: '',
          appId: '',
          mchId: '',
          appKey: '',
          status: 0,
          paymentType: 1,
          createSysUserId: '',
          createTime: '',
          updateSysUserId: '',
          updateTime: '',
          key: ''
        },
        dataRule: {
          name: [
            {required: true, message: this.$t('manage.operation.payment.rule.name'), trigger: 'blur'},
            {length: 50, message: this.$t('manage.operation.payment.rule.name'), trigger: 'blur'}
          ],
          image: [
            {required: true, message: this.$t('manage.operation.payment.rule.image'), trigger: 'blur'}
          ],
          appId: [
            {required: true, message: this.$t('manage.operation.payment.rule.appId'), trigger: 'blur'}
          ],
          mchId: [
            {required: true, message: this.$t('manage.operation.payment.rule.mchId'), trigger: 'blur'}
          ],
          appKey: [
            {required: true, message: this.$t('manage.operation.payment.rule.appKey'), trigger: 'blur'}
          ],
          status: [
            {required: true, message: this.$t('manage.operation.payment.rule.status'), trigger: 'blur'}
          ],
          paymentType: [
            {required: true, message: this.$t('manage.operation.payment.rule.paymentType'), trigger: 'blur'}
          ],
          key: [
            {required: true, message: this.$t('manage.operation.payment.rule.key'), trigger: 'blur'},
            {validator: checkNum,message:this.$t('manage.operation.payment.rule.keyRule'), trigger: 'blur'}
          ]
        }
      }
    },

    // mounted(){
    //
    // },
    methods: {
      init(id) {
        this.dataForm.id = id || 0;
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            paymentmethod.info(this.dataForm.id).then(({data}) => {

              if (data && data.code === 200) {
                this.dataForm.name = data.paymentMethod.name;
                this.dataForm.image = data.paymentMethod.image;
                this.dataForm.appId = data.paymentMethod.appId;
                this.dataForm.mchId = data.paymentMethod.mchId;
                this.dataForm.appKey = data.paymentMethod.appKey;
                this.dataForm.status = data.paymentMethod.status;
                this.dataForm.paymentType = data.paymentMethod.paymentType;
                this.dataForm.createSysUserId = data.paymentMethod.createSysUserId;
                this.dataForm.createTime = data.paymentMethod.createTime;
                this.dataForm.updateSysUserId = data.paymentMethod.updateSysUserId;
                this.dataForm.updateTime = data.paymentMethod.updateTime;
                this.dataForm.key = data.paymentMethod.key;
                if (this.dataForm.image){
                  this.imageUrl=this.global.showUrl+this.dataForm.image;
                }
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'image': this.dataForm.image,
              'appId': this.dataForm.appId,
              'mchId': this.dataForm.mchId,
              'appKey': this.dataForm.appKey,
              'status': this.dataForm.status,
              'paymentType': this.dataForm.paymentType,
              'key': this.dataForm.key,
            };
            let tick = !this.dataForm.id ? paymentmethod.add(params) : paymentmethod.update(params);
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: this.$t('common.success'),
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
      handleAvatarSuccess(res, file) {
        console.log(res)
        this.imageUrl = URL.createObjectURL(file.raw);
        if (res && res.code === 200) {
          this.dataForm.image = res.result.title;
        }
      },
      beforeAvatarUpload(file) {
        return true;
      },
      changePaymentType() {
        if (this.dataForm.paymentType === 1) this.wxShow = true;
        if (this.dataForm.paymentType === 2) this.wxShow = false;
      }

    }
  }
</script>

