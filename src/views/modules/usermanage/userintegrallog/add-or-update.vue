<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="" prop="userId">
        <el-input v-model="dataForm.userId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="以前的积分" prop="previousValue">
        <el-input v-model="dataForm.previousValue" placeholder="以前的积分"></el-input>
      </el-form-item>
      <el-form-item label="当前的积分" prop="currentValue">
        <el-input v-model="dataForm.currentValue" placeholder="当前的积分"></el-input>
      </el-form-item>
      <el-form-item label="改变积分" prop="changeValue">
        <el-input v-model="dataForm.changeValue" placeholder="改变积分"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="1 进账，2 出账" prop="type">
        <el-input v-model="dataForm.type" placeholder="1 进账，2 出账"></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="交易订单号" prop="transactionId">
        <el-input v-model="dataForm.transactionId" placeholder="交易订单号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {userintegrallog} from '@/action/userintegrallog'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userId: '',
          previousValue: '',
          currentValue: '',
          changeValue: '',
          remark: '',
          type: '',
          createTime: '',
          transactionId: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          previousValue: [
            { required: true, message: '以前的积分不能为空', trigger: 'blur' }
          ],
          currentValue: [
            { required: true, message: '当前的积分不能为空', trigger: 'blur' }
          ],
          changeValue: [
            { required: true, message: '改变积分不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '1 进账，2 出账不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          transactionId: [
            { required: true, message: '交易订单号不能为空', trigger: 'blur' }
          ]
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
            userintegrallog.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.userId = data.userintegrallog.userId
                this.dataForm.previousValue = data.userintegrallog.previousValue
                this.dataForm.currentValue = data.userintegrallog.currentValue
                this.dataForm.changeValue = data.userintegrallog.changeValue
                this.dataForm.remark = data.userintegrallog.remark
                this.dataForm.type = data.userintegrallog.type
                this.dataForm.createTime = data.userintegrallog.createTime
                this.dataForm.transactionId = data.userintegrallog.transactionId
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'userId': this.dataForm.userId,
              'previousValue': this.dataForm.previousValue,
              'currentValue': this.dataForm.currentValue,
              'changeValue': this.dataForm.changeValue,
              'remark': this.dataForm.remark,
              'type': this.dataForm.type,
              'createTime': this.dataForm.createTime,
              'transactionId': this.dataForm.transactionId
            }
            var tick = !this.dataForm.id ? userintegrallog.add(params) : userintegrallog.update(params)
            tick.then(({data}) => {
              if (data && data.code === 200) {
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
      }
    }
  }
</script>
