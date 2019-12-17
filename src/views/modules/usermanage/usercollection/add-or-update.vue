<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="商品id" prop="comodityId">
        <el-input v-model="dataForm.comodityId" placeholder="商品id"></el-input>
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
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
  import {userCollection} from '@/action/usercollection'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          comodityId: '',
          userId: '',
          createTime: ''
        },
        dataRule: {
          comodityId: [
            { required: true, message: '商品id不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
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
            userCollection.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.comodityId = data.usercollection.comodityId
                this.dataForm.userId = data.usercollection.userId
                this.dataForm.createTime = data.usercollection.createTime
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
              'comodityId': this.dataForm.comodityId,
              'userId': this.dataForm.userId,
              'createTime': this.dataForm.createTime
            }
            var tick = !this.dataForm.id ? userCollection.add(params) : userCollection.update(params)
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
