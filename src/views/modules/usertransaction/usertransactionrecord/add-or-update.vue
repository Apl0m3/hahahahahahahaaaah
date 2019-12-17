<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="订单号" prop="transactionId">
        <el-input v-model="dataForm.transactionId" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="第三方订单号" prop="tripartiteTransactionId">
        <el-input v-model="dataForm.tripartiteTransactionId" placeholder="第三方订单号"></el-input>
      </el-form-item>
      <el-form-item label="物流单号" prop="shipmentId">
        <el-input v-model="dataForm.shipmentId" placeholder="物流单号"></el-input>
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="支付方式id" prop="paymentMethodId">
        <el-input v-model="dataForm.paymentMethodId" placeholder="支付方式id"></el-input>
      </el-form-item>
      <el-form-item label="支付总金额" prop="totalAmount">
        <el-input v-model="dataForm.totalAmount" placeholder="支付总金额"></el-input>
      </el-form-item>
      <el-form-item label="实际支付金额" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="实际支付金额"></el-input>
      </el-form-item>
      <el-form-item label="0 未使用  1 使用" prop="integralUseStatus">
        <el-input v-model="dataForm.integralUseStatus" placeholder="0 未使用  1 使用"></el-input>
      </el-form-item>
      <el-form-item label="使用积分" prop="integral">
        <el-input v-model="dataForm.integral" placeholder="使用积分"></el-input>
      </el-form-item>
      <el-form-item label="积分抵扣金额" prop="integralDeductionAmount">
        <el-input v-model="dataForm.integralDeductionAmount" placeholder="积分抵扣金额"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="订单状态"></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {usertransactionrecord} from '@/action/usertransactionrecord'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          transactionId: '',
          tripartiteTransactionId: '',
          shipmentId: '',
          userId: '',
          paymentMethodId: '',
          totalAmount: '',
          amount: '',
          integralUseStatus: '',
          integral: '',
          integralDeductionAmount: '',
          status: '',
          createTime: ''
        },
        dataRule: {
          transactionId: [
            { required: true, message: '订单号不能为空', trigger: 'blur' }
          ],
          tripartiteTransactionId: [
            { required: true, message: '第三方订单号不能为空', trigger: 'blur' }
          ],
          shipmentId: [
            { required: true, message: '物流单号不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
          ],
          paymentMethodId: [
            { required: true, message: '支付方式id不能为空', trigger: 'blur' }
          ],
          totalAmount: [
            { required: true, message: '支付总金额不能为空', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '实际支付金额不能为空', trigger: 'blur' }
          ],
          integralUseStatus: [
            { required: true, message: '0 未使用  1 使用不能为空', trigger: 'blur' }
          ],
          integral: [
            { required: true, message: '使用积分不能为空', trigger: 'blur' }
          ],
          integralDeductionAmount: [
            { required: true, message: '积分抵扣金额不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '订单状态不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
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
            usertransactionrecord.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.transactionId = data.usertransactionrecord.transactionId
                this.dataForm.tripartiteTransactionId = data.usertransactionrecord.tripartiteTransactionId
                this.dataForm.shipmentId = data.usertransactionrecord.shipmentId
                this.dataForm.userId = data.usertransactionrecord.userId
                this.dataForm.paymentMethodId = data.usertransactionrecord.paymentMethodId
                this.dataForm.totalAmount = data.usertransactionrecord.totalAmount
                this.dataForm.amount = data.usertransactionrecord.amount
                this.dataForm.integralUseStatus = data.usertransactionrecord.integralUseStatus
                this.dataForm.integral = data.usertransactionrecord.integral
                this.dataForm.integralDeductionAmount = data.usertransactionrecord.integralDeductionAmount
                this.dataForm.status = data.usertransactionrecord.status
                this.dataForm.createTime = data.usertransactionrecord.createTime
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
              'transactionId': this.dataForm.transactionId,
              'tripartiteTransactionId': this.dataForm.tripartiteTransactionId,
              'shipmentId': this.dataForm.shipmentId,
              'userId': this.dataForm.userId,
              'paymentMethodId': this.dataForm.paymentMethodId,
              'totalAmount': this.dataForm.totalAmount,
              'amount': this.dataForm.amount,
              'integralUseStatus': this.dataForm.integralUseStatus,
              'integral': this.dataForm.integral,
              'integralDeductionAmount': this.dataForm.integralDeductionAmount,
              'status': this.dataForm.status,
              'createTime': this.dataForm.createTime
            }
            var tick = !this.dataForm.id ? usertransactionrecord.add(params) : usertransactionrecord.update(params)
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
