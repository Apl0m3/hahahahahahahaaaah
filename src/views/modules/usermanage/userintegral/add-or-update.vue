<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="积分" prop="integral">
        <el-input v-model="dataForm.integral" placeholder="积分"></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="0 正常 1 禁用" prop="status">
        <el-input v-model="dataForm.status" placeholder="0 正常 1 禁用"></el-input>
      </el-form-item>
      <el-form-item label="" prop="modifyTime">
        <el-input v-model="dataForm.modifyTime" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {userintegral} from '@/action/userintegral'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userId: '',
          integral: '',
          createTime: '',
          status: '',
          modifyTime: ''
        },
        dataRule: {
          userId: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
          ],
          integral: [
            { required: true, message: '积分不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '0 正常 1 禁用不能为空', trigger: 'blur' }
          ],
          modifyTime: [
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
            userintegral.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.userId = data.userintegral.userId
                this.dataForm.integral = data.userintegral.integral
                this.dataForm.createTime = data.userintegral.createTime
                this.dataForm.status = data.userintegral.status
                this.dataForm.modifyTime = data.userintegral.modifyTime
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
              'integral': this.dataForm.integral,
              'createTime': this.dataForm.createTime,
              'status': this.dataForm.status,
              'modifyTime': this.dataForm.modifyTime
            }
            var tick = !this.dataForm.id ? userintegral.add(params) : userintegral.update(params)
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
