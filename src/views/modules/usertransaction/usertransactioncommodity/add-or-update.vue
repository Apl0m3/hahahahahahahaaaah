<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="订单号" prop="transactionId">
        <el-input v-model="dataForm.transactionId" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="商品id" prop="commodityId">
        <el-input v-model="dataForm.commodityId" placeholder="商品id"></el-input>
      </el-form-item>
      <el-form-item label="商品规格id" prop="commodityNormId">
        <el-input v-model="dataForm.commodityNormId" placeholder="商品规格id"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="amount">
        <el-input v-model="dataForm.amount" placeholder="商品价格"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {usertransactioncommodity} from '@/action/usertransactioncommodity'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          transactionId: '',
          commodityId: '',
          commodityNormId: '',
          amount: ''
        },
        dataRule: {
          transactionId: [
            { required: true, message: '订单号不能为空', trigger: 'blur' }
          ],
          commodityId: [
            { required: true, message: '商品id不能为空', trigger: 'blur' }
          ],
          commodityNormId: [
            { required: true, message: '商品规格id不能为空', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '商品价格不能为空', trigger: 'blur' }
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
            usertransactioncommodity.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.transactionId = data.usertransactioncommodity.transactionId
                this.dataForm.commodityId = data.usertransactioncommodity.commodityId
                this.dataForm.commodityNormId = data.usertransactioncommodity.commodityNormId
                this.dataForm.amount = data.usertransactioncommodity.amount
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
              'commodityId': this.dataForm.commodityId,
              'commodityNormId': this.dataForm.commodityNormId,
              'amount': this.dataForm.amount
            }
            var tick = !this.dataForm.id ? usertransactioncommodity.add(params) : usertransactioncommodity.update(params)
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
