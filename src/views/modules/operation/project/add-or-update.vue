<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="logo" prop="companyLogo">
        <el-input v-model="dataForm.companyLogo" placeholder="logo"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companName">
        <el-input v-model="dataForm.companName" placeholder="公司名称"></el-input>
      </el-form-item>
      <el-form-item label="应用名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="应用名称"></el-input>
      </el-form-item>
      <el-form-item label="" prop="email">
        <el-input v-model="dataForm.email" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="address">
        <el-input v-model="dataForm.address" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="phome">
        <el-input v-model="dataForm.phome" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="remark">
        <el-input v-model="dataForm.remark" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="createSysUserId">
        <el-input v-model="dataForm.createSysUserId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="updateSysUserId">
        <el-input v-model="dataForm.updateSysUserId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {project} from '@/action/project'
  export default {
    data (){
      return {
        visible: false,
        dataForm: {
          id: 0,
          companyLogo: '',
          companName: '',
          name: '',
          email: '',
          address: '',
          phome: '',
          remark: '',
          createSysUserId: '',
          createTime: '',
          updateSysUserId: '',
          updateTime: ''
        },
        dataRule: {
          companyLogo: [
            { required: true, message: 'logo不能为空', trigger: 'blur' }
          ],
          companName: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '应用名称不能为空', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          phome: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createSysUserId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateSysUserId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id){
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id){
            project.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 0){
                this.dataForm.companyLogo = data.project.companyLogo
                this.dataForm.companName = data.project.companName
                this.dataForm.name = data.project.name
                this.dataForm.email = data.project.email
                this.dataForm.address = data.project.address
                this.dataForm.phome = data.project.phome
                this.dataForm.remark = data.project.remark
                this.dataForm.createSysUserId = data.project.createSysUserId
                this.dataForm.createTime = data.project.createTime
                this.dataForm.updateSysUserId = data.project.updateSysUserId
                this.dataForm.updateTime = data.project.updateTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit (){
        this.$refs['dataForm'].validate((valid) => {
          if (valid){
            var params = {
              'id': this.dataForm.id || undefined,
              'companyLogo': this.dataForm.companyLogo,
              'companyName': this.dataForm.companName,
              'name': this.dataForm.name,
              'email': this.dataForm.email,
              'address': this.dataForm.address,
              'phone': this.dataForm.phome,
              'remark': this.dataForm.remark,
              'createSysUserId': this.dataForm.createSysUserId,
              'createTime': this.dataForm.createTime,
              'updateSysUserId': this.dataForm.updateSysUserId,
              'updateTime': this.dataForm.updateTime
            }
            var tick = !this.dataForm.id ? project.add(params) : project.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0){
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
