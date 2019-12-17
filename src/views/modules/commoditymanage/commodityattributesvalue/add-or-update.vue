<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <!--属性图片--><el-form-item label="属性图片" v-if="type1" prop="url">
      <el-upload
        class="avatar-uploader"
        :action="global.uploadUrl"
        :show-file-list="false"
        accept="image/jpeg,image/gif,image/png"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :multiple="true"
      >
        <img v-if="dataForm.url" :src="global.showUrl+dataForm.url" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
      <template v-for="(item,index) in commodityattributevalueamount">
        <!--商品数量阶梯--><el-form-item label="商品数量" prop="num">
        <el-select v-model="item.commodityNumId" :clearable="true" placeholder="商品数量"    >
          <el-option
            v-for="item1 in commodityNum"
            :key="item1.id"
            :label="item1.num"
            :value="item1.id">
            <!--<span style="float: left">{{ item.name }}</span>-->
            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>-->
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item :label="'加价'+(index+1)" style="width: 50%"
                      :prop="'commodityattributevalueamount.'+index+'.amount'">
                      <!--:rules="[{required:true,message:'属性不能为空',trigger:'blur'},{validator: checkName,message:'属性不能为空', trigger: 'blur'}]"-->
          <el-input v-model="item.amount">

            <el-button v-if="(!dataForm.id) && index !== 0" slot="append" icon="el-icon-delete" @click="deleteItem(index)"></el-button>
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commodityattributesvalue} from '@/action/commodityattributesvalue'
  import {commoditynum} from '@/action/commoditynum'

  export default {
    data () {
      var checkName = (rule, value, callback) => {
        value = value.replace(/\s+/g, '')
        if (!value) {
          return callback(new Error(this.$t('manage.commodity.addOrUpdate.dataRule.checkName')))
        } else {
          callback()
        }
      }
      return {
        commodityNum: [],
        commodityattributevalueamount: [],
        commodityId: '',
        visible: false,
        type1: true,
        dataForm: {
          id: 0,
          commodityAttributesId: '',
          name: '',
          amount: '',
          url: '',
          parentId: '',
          type: '',
          status: ''
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '加价不能为空', trigger: 'blur' },
            {validator: checkName, message: '加价不能为空', trigger: 'blur'}

          ],
          url: [
            { required: true, message: '图片地址不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (commodityAttributesId, id, type, commodityId) {
        this.dataForm.id = id || 0
        this.visible = true
        if (type === 1) {
          this.type1 = false
        }
        this.commodityId = commodityId
        this.dataForm.commodityAttributesId = commodityAttributesId
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            commodityattributesvalue.list2({id: this.dataForm.id, commodityId: this.commodityId}).then(({data}) => {
              if (data && data.code === 200) {
                // commodityAttributesAddDto
                let commodityAttributesValue = data.commodityAttributesAddDto.commodityAttributesValue
                this.dataForm.commodityAttributesId = commodityAttributesValue.commodityAttributesId
                this.dataForm.name = commodityAttributesValue.name
                this.dataForm.amount = commodityAttributesValue.amount
                this.dataForm.url = commodityAttributesValue.url
                this.dataForm.parentId = commodityAttributesValue.parentId
                this.commodityattributevalueamount = data.commodityAttributesAddDto.commodityAttributeValueAmounts
              }
            })
            // commodityattributesvalue.info(this.dataForm.id).then(({data}) => {
            //   if (data && data.code === 200) {
            //     this.dataForm.commodityAttributesId = data.commodityAttributesValue.commodityAttributesId
            //     this.dataForm.name = data.commodityAttributesValue.name
            //     this.dataForm.amount = data.commodityAttributesValue.amount
            //     this.dataForm.url = data.commodityAttributesValue.url
            //     this.dataForm.parentId = data.commodityAttributesValue.parentId
            //   }
            // })
            // commodityattributevalueamount.list({ commodityId: this.commodityId, attributeValueId: this.dataForm.id }).then(({data}) => {
            //   if (data && data.code === 200) {
            //     this.commodityattributevalueamount = data.page.list
            //   }
            // })
          }
          commoditynum.list({commodityId: this.commodityId}).then(({data}) => {
            if (data && data.code === 200) {
              this.commodityNum = data.page.list
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.status = 0
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'id': this.dataForm.id || undefined,
              'commodityAttributesId': this.dataForm.commodityAttributesId,
              'name': this.dataForm.name,
              'amount': this.dataForm.amount,
              'url': this.dataForm.url,
              'status': this.dataForm.status,
              'parentId': this.dataForm.parentId
            }
            var tick = !this.dataForm.id ? commodityattributesvalue.add(params) : commodityattributesvalue.update(params)
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList', this.dataForm.commodityAttributesId)
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      handleAvatarSuccess (res, file) {
        if (res && res.code === 200) {
          this.dataForm.url = res.result.title
        }
      },
  // 单张图片
      beforeAvatarUpload (file) {
        return true
      },
      addItem () {
        this.dataForm.commodityAttributesValues.push({id: null, name: null, url: null})
      },
      deleteItem (i) {
        this.dataForm.commodityAttributesValues.splice(i, 1)
      }
    }
  }
</script>
