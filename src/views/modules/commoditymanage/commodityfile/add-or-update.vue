<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="文件类型（1 图片，2 视频）" prop="fileType">
        <el-input v-model="dataForm.fileType" placeholder="文件类型（1 图片，2 视频）"></el-input>
      </el-form-item>
      <el-form-item label="类型（1-商品文件 2-评论文件）" prop="type">
        <el-input v-model="dataForm.type" placeholder="类型（1-商品文件 2-评论文件）"></el-input>
      </el-form-item>
      <el-form-item label="type=1 商品id，type=2 评论id" prop="operateId">
        <el-input v-model="dataForm.operateId" placeholder="type=1 商品id，type=2 评论id"></el-input>
      </el-form-item>
      <el-form-item label="文件路劲" prop="fileUrl">
        <el-input v-model="dataForm.fileUrl" placeholder="文件路劲"></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="type=2 null" prop="createSysUserId">
        <el-input v-model="dataForm.createSysUserId" placeholder="type=2 null"></el-input>
      </el-form-item>
      <el-form-item label="type=2 null" prop="updateSysUserId">
        <el-input v-model="dataForm.updateSysUserId" placeholder="type=2 null"></el-input>
      </el-form-item>
      <el-form-item label="type=2 null" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder="type=2 null"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commodityFile} from '@/action/commodityfile'

  export default {
    data(){
      return {
        visible: false,
        dataForm: {
          id: 0,
          fileType: '',
          type: '',
          operateId: '',
          fileUrl: '',
          createTime: '',
          createSysUserId: '',
          updateSysUserId: '',
          updateTime: ''
        },
        dataRule: {
          fileType: [
            {required: true, message: '文件类型（1 图片，2 视频）不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '类型（1-商品文件 2-评论文件）不能为空', trigger: 'blur'}
          ],
          operateId: [
            {required: true, message: 'type=1 商品id，type=2 评论id不能为空', trigger: 'blur'}
          ],
          fileUrl: [
            {required: true, message: '文件路劲不能为空', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          createSysUserId: [
            {required: true, message: 'type=2 null不能为空', trigger: 'blur'}
          ],
          updateSysUserId: [
            {required: true, message: 'type=2 null不能为空', trigger: 'blur'}
          ],
          updateTime: [
            {required: true, message: 'type=2 null不能为空', trigger: 'blur'}
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
            commodityFile.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.fileType = data.commodityfile.fileType
                this.dataForm.type = data.commodityfile.type
                this.dataForm.operateId = data.commodityfile.operateId
                this.dataForm.fileUrl = data.commodityfile.fileUrl
                this.dataForm.createTime = data.commodityfile.createTime
                this.dataForm.createSysUserId = data.commodityfile.createSysUserId
                this.dataForm.updateSysUserId = data.commodityfile.updateSysUserId
                this.dataForm.updateTime = data.commodityfile.updateTime
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
              'fileType': this.dataForm.fileType,
              'type': this.dataForm.type,
              'operateId': this.dataForm.operateId,
              'fileUrl': this.dataForm.fileUrl,
              'createTime': this.dataForm.createTime,
              'createSysUserId': this.dataForm.createSysUserId,
              'updateSysUserId': this.dataForm.updateSysUserId,
              'updateTime': this.dataForm.updateTime
            }
            var tick = !this.dataForm.id ? commodityFile.add(params) : commodityFile.update(params)
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
