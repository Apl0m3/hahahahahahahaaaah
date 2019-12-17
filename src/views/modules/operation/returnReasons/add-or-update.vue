<template>
  <el-dialog
    :title="!dataForm.id ? $t('common.add') : $t('common.update')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="$t('manage.operation.retrunReason.name')" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('manage.operation.retrunReason.namePla')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.operation.retrunReason.remark')" prop="remark">
        <el-input type="textarea" maxlength="500" v-model="dataForm.remark" :placeholder="$t('manage.operation.retrunReason.remarkPla')"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" :disabled="repeatVisible" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {returnReasons} from '@/action/returnReasons'
  export default {
    data () {
      return {
        visible: false,
        repeatVisible: false,
        dataForm: {
          id: 0,
          name: '',
          remark: '',
          createTime: '',
          createBy: '',
          updateTime: '',
          updateBy: ''
        },
        dataRule: {
          name: [
            { required: true, message: this.$t('manage.operation.retrunReason.nameRule'), trigger: 'blur' }
          ],
          remark: [
            { required: true, message: this.$t('manage.operation.retrunReason.remarkRule'), trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.repeatVisible = false
          this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            returnReasons.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.name = data.returnReasons.name
                this.dataForm.remark = data.returnReasons.remark
                this.dataForm.createTime = data.returnReasons.createTime
                this.dataForm.createBy = data.returnReasons.createBy
                this.dataForm.updateTime = data.returnReasons.updateTime
                this.dataForm.updateBy = data.returnReasons.updateBy
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.repeatVisible = true
            var params = {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'remark': this.dataForm.remark,
              'createTime': this.dataForm.createTime,
              'createBy': this.dataForm.createBy,
              'updateTime': this.dataForm.updateTime,
              'updateBy': this.dataForm.updateBy
            }
            var tick = !this.dataForm.id ? returnReasons.add(params) : returnReasons.update(params)
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
                this.repeatVisible = false
              }
            })
          }
        })
      }
    }
  }
</script>
