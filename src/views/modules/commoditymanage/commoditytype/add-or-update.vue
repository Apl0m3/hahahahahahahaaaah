<template>
  <el-dialog
    :title="!dataForm.id ? $t('manage.commodity.commodityType.addOrUpdate.addTitle') : $t('manage.commodity.commodityType.addOrUpdate.updateTitle')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item :label="$t('manage.commodity.commodityType.name')" prop="name">
        <el-input v-model.trim="dataForm.name" :placeholder="$t('manage.commodity.commodityType.addOrUpdate.commodityTypeNamePlaceholder')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('manage.commodity.commodityType.commission')" prop="commission">
        <el-input v-model.trim="dataForm.commission" :placeholder="$t('manage.commodity.commodityType.addOrUpdate.commissionPlaceholder')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('manage.commodity.commodityType.image')" prop="image">
        <el-upload
          class="avatar-uploader"
          :action="global.uploadUrl"
          :show-file-list="false"
          accept="image/jpeg,image/gif,image/png"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="dataForm.image" :src="global.showUrl+dataForm.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commoditytype} from '@/action/commoditytype'

  export default {
    data () {
      const checkName = (rule, value, callback) => {
        value = value.replace(/\s+/g, '');
        // if (this.checkSpecificKey(value)) {
        //   callback();
        // } else {
        //   callback(new Error(this.$t('manage.coupon.validate.wrongName')))
        // }
      };
      const checkCommission = (rule, value, callback) => {
        if (value == "" || value =="0.00") {
          callback(new Error(this.$t('common.error')));
        } else {
          let reg = /^[0-9]+([.]{1}[0-9]{0,2})?$/;
          if (!reg.test(value)) {
            callback(new Error(this.$t('common.error')));
          } else {
            callback();
          }
        }
      };
      return {
        repeatVisible: false,
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          image: '',
          commission: ''
        },
        dataRule: {
          name: [
            {required: true, message: this.$t('manage.commodity.commodityType.addOrUpdate.dataRule.nameMsg'), trigger: 'blur'},
            {max: 30, message: this.$t('manage.commodity.commodityType.addOrUpdate.dataRule.maxNameMsg'), trigger: 'blur'},
            // {validator: checkName, trigger: 'blur'}
          ],
          image: [
            {required: true, message: this.$t('manage.commodity.commodityType.addOrUpdate.dataRule.imageMsg'), trigger: 'blur'}
          ],
          commission: [
            {required: true, message: this.$t('manage.commodity.commodityType.addOrUpdate.dataRule.commissionRule'), trigger: 'blur'},
            {validator: checkCommission, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {

      init: function (id) {
        this.dataForm.id = id;
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            commoditytype.info(id).then(({data}) => {
              if (data && data.code === 200) {
                // console.log(data)
                this.dataForm.id = data.commodityType.id
                this.dataForm.name = data.commodityType.name
                this.dataForm.image = data.commodityType.image
                this.dataForm.commission = data.commodityType.commission
              } else {
                this.$message.error(data.msg)
                this.repeatVisible = false
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.repeatVisible = true
            var params = {
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'image': this.dataForm.image,
              'commission': this.dataForm.commission,
            }
            var tick = !this.dataForm.id ? commoditytype.add(params) : commoditytype.update(params)
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: this.$t('common.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                    this.repeatVisible = false
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.repeatVisible = false
              }
            })
          }
        })
      },
      // 单张图片
      handleAvatarSuccess (res, file) {
        if (res && res.code === 200) {
          this.dataForm.image = res.result.title
        }
      },
      // 单张图片
      beforeAvatarUpload (file) {
        return true
      },
      //特殊字符过滤
      checkSpecificKey(str) {
        var specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】@‘；：”“'。，、？\"\"]‘'";
        for (var i = 0; i < str.length; i++) {
          if (specialKey.indexOf(str.substr(i, 1)) != -1) {
            return false;
          }
        }
        return true;
      },
    }
  }
</script>
