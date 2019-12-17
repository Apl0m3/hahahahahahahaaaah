<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="数量" prop="num">
        <el-input v-model="dataForm.num" placeholder="数量"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commoditynum} from '@/action/commoditynum'
  export default {
    data () {
      return {
        visible: false,
        commodityId1: '',
        dataForm: {
          id: 0,
          commodityId: '',
          num: '',
          sort: '',
          createTime: ''
        },
        dataRule: {
          num: [
            { required: true, message: '数量不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id, commodityId) {
        this.dataForm.id = id || 0
        this.visible = true
        this.commodityId1 = commodityId
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            commoditynum.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.num = data.commodityNum.num
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
              'commodityId': this.commodityId1,
              'num': this.dataForm.num,
              'sort': this.dataForm.sort,
              'createTime': this.dataForm.createTime
            }
            var tick = !this.dataForm.id ? commoditynum.add(params) : commoditynum.update(params)
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList', this.commodityId1)
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
