<template>
  <el-dialog
    :title="!dataForm.id ? $t('common.add') : $t('common.update')"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
      <el-form-item :label="$t('manage.operation.rate.type')" prop="type" >
        <el-radio disabled="disabled" v-model="dataForm.type" :label="1">{{$t('manage.operation.rate.type1')}}</el-radio>
        <el-radio disabled="disabled" v-model="dataForm.type" :label="2">{{$t('manage.operation.rate.type2')}}</el-radio>
      </el-form-item>


      <el-form-item :label="$t('manage.operation.rate.rate')" prop="rate">
        <el-input v-model="dataForm.rate" ></el-input>
      </el-form-item>



    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {rate} from '../../../../action/rate'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          type:1,
          rate:'',
          id:0,
        },
        dataRule: {
          type: [
            { required: true, message: this.$t('manage.operation.rate.typeRule'), trigger: 'blur' }
          ],
          rate: [
            { required: true, message: this.$t('manage.operation.rate.rateRule'), trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            rate.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.type = data.operateRate.type;
                this.dataForm.rate = data.operateRate.rate
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = {
              'type': this.dataForm.type,
              'rate': this.dataForm.rate,
              'id': this.dataForm.id || undefined,
            }
            let tick = !this.dataForm.id ? rate.add(params) : rate.update(params)
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
      beforeAvatarUpload(file) {
        return true;
      },
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        // console.log(res)
        if (res && res.code === 200) {
          this.dataForm.logo = res.result.title;
        }
      },
      closeDialog(){
        this.dataForm.logo=''
      },
    }
  }
</script>
