<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="属性名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="type">
        <!--请选择属性类型--><el-select  placeholder="请选择类型" v-model="dataForm.type" :clearable="true">
        <el-option-group>
          <!--文字描述--><el-option :value="1" label="文字描述">文字描述</el-option>
          <!--图片--><el-option :value="2" label="图片">图片</el-option>
          <!--图文--><el-option :value="3" label="图文">图文</el-option>
        </el-option-group>
      </el-select>
      </el-form-item>
      <el-form-item label="上级属性" prop="parentId">
        <!--上级属性--><el-select v-model="dataForm.parentId" :clearable="true" @change="selectOne" placeholder="请选择上级属性"   >
        <el-option
          v-for="item in parent"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <span style="float: left">{{ item.name }}</span>
          <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>-->
        </el-option>
      </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commodityattributes} from '@/action/commodityattributes'

  export default {
    data () {
      return {
        parent: [],
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          remark: '',
          parentId: '',
          type: '',
          status: '',
          createBy: '',
          createTime: '',
          updateBy: '',
          updateTime: '',
          commodityId: ''
        },
        dataRule: {
          name: [
            { required: true, message: '属性名称不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '属性类型', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      selectOne (id) {
        this.dataForm.parentId = id
      },
      init (commodityId, id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.dataForm.commodityId = commodityId
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            commodityattributes.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.name = data.commodityAttributes.name
                this.dataForm.remark = data.commodityAttributes.remark
                this.dataForm.parentId = data.commodityAttributes.parentId
                this.dataForm.type = data.commodityAttributes.type
                this.dataForm.commodityId = data.commodityAttributes.commodityId
              }
            })
          }
          commodityattributes.list({}).then(({data}) => {
            if (data && data.code === 200) {
              this.parent = data.page.list
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'remark': this.dataForm.remark,
              'parentId': this.dataForm.parentId,
              'type': this.dataForm.type,
              'commodityId': this.dataForm.commodityId
            }
            var tick = !this.dataForm.id ? commodityattributes.add(params) : commodityattributes.update(params)
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList', this.dataForm.commodityId)
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
