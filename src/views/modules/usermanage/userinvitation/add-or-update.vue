<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="邀请用户注册的用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="邀请用户注册的用户id"></el-input>
      </el-form-item>
      <el-form-item label="被邀请用户id" prop="invitedUserId">
        <el-input v-model="dataForm.invitedUserId" placeholder="被邀请用户id"></el-input>
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
  import {userinvitation} from '@/action/userinvitation'

  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          id: 0,
          userId: '',
          invitedUserId: '',
          createTime: ''
        },
        dataRule: {
          userId: [
            {required: true, message: '邀请用户注册的用户id不能为空', trigger: 'blur'}
          ],
          invitedUserId: [
            {required: true, message: '被邀请用户id不能为空', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '不能为空', trigger: 'blur'}
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
            userinvitation.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.userId = data.userinvitation.userId
                this.dataForm.invitedUserId = data.userinvitation.invitedUserId
                this.dataForm.createTime = data.userinvitation.createTime
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
              'userId': this.dataForm.userId,
              'invitedUserId': this.dataForm.invitedUserId,
              'createTime': this.dataForm.createTime
            }
            var tick = !this.dataForm.id ? userinvitation.add(params) : userinvitation.update(params)
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
