<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="" prop="userId">
        <el-input v-model="dataForm.userId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="商品规格id" prop="commodityNormId">
        <el-input v-model="dataForm.commodityNormId" placeholder="商品规格id"></el-input>
      </el-form-item>
      <el-form-item label="" prop="amount">
        <el-input v-model="dataForm.amount" placeholder=""></el-input>
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
  import {usercommoditycart} from '@/action/usercommoditycart'

  export default {
    data (){
      return {
        visible: false,
        dataForm: {
          id: 0,
          userId: '',
          commodityNormId: '',
          amount: '',
          createTime: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          commodityNormId: [
            { required: true, message: '商品规格id不能为空', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '不能为空', trigger: 'blur' }
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
            usercommoditycart.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.userId = data.usercommoditycart.userId
                this.dataForm.commodityNormId = data.usercommoditycart.commodityNormId
                this.dataForm.amount = data.usercommoditycart.amount
                this.dataForm.createTime = data.usercommoditycart.createTime
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
              'commodityNormId': this.dataForm.commodityNormId,
              'amount': this.dataForm.amount,
              'createTime': this.dataForm.createTime
            }
            var tick = !this.dataForm.id ? usercommoditycart.add(params) : usercommoditycart.update(params)
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
