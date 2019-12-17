<template>
  <el-dialog
    :title="$t('manage.usermanage.userAgent.detail.title')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item :label="$t('manage.usermanage.userAgent.name')" prop="name" >
        <el-input v-model="dataForm.name" :disabled="true" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.mail')" prop="mail" >
        <el-input v-model="dataForm.mail" :disabled="true"  placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.detail.addressName')" prop="addressName" >
        <el-input v-model="dataForm.addressName" :disabled="true" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.detail.postalCode')" prop="postalCode" >
        <el-input v-model="dataForm.postalCode" :disabled="true" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.detail.provinceStr')" prop="provinceStr" >
        <el-input v-model="dataForm.provinceStr" :disabled="true" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.detail.cityStr')" prop="cityStr" >
        <el-input v-model="dataForm.cityStr" :disabled="true" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.detail.country')" prop="country" >
        <el-input v-model="dataForm.country" :disabled="true" placeholder=""></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.detail.businessLicenseUrl')" prop="businessLicenseUrl" >
        <img v-if="dataForm.businessLicenseUrl" :src="global.showUrl+dataForm.businessLicenseUrl" class="avatar"
             style="width: 178px;height: 178px">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-form-item>
      <el-form-item :label="$t('manage.usermanage.userAgent.typeName')" prop="typeName" >
        <el-input v-model="dataForm.typeName" :disabled="true"  placeholder=""></el-input>
      </el-form-item>
<!--      <el-form-item label="申请时间" prop="createTime" >-->
<!--        <el-input v-model="dataForm.createTime" :disabled="true"  placeholder=""></el-input>-->
<!--      </el-form-item>-->
      <el-form-item :label="$t('manage.usermanage.userAgent.status')" prop="status" v-if="dataForm.showStatusVisible === 0">
        <el-select v-model="dataForm.status" :disabled="status!==0" >
          <el-option :label="$t('manage.usermanage.userAgent.status2')"  :value="1">{{$t('manage.usermanage.userAgent.status2')}}
          </el-option>
          <el-option :label="$t('manage.usermanage.userAgent.status3')" :value="2">{{$t('manage.usermanage.userAgent.status3')}}
          </el-option>
        </el-select>
        <!--        <el-input v-model="dataForm.status" placeholder="0-已申请，审核中，1-审核成功，2-申请失败"></el-input>-->
      </el-form-item>
      <el-form-item v-if="dataForm.showStatusVisible === 2 || dataForm.status === 2":label="$t('manage.usermanage.userAgent.detail.reason')" prop="reason">
        <el-input v-if="dataForm.showStatusVisible === 0"  v-model="dataForm.reason" ></el-input>
        <el-input v-if="dataForm.showStatusVisible !== 0"  disabled="disabled" v-model="dataForm.reason" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      <el-button  v-if="dataForm.showBtn"  type="primary" @click="dataFormSubmit()" >{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {userMemberApplication} from '../../../../action/usermemberapplication'

  export default {
    data() {
      return {
        visible: false,
        repeatVisible:false,
        dataForm: {
          id: 0,
          userId: '',
          name: '',
            addressName:'',
            postalCode:'',
            provinceStr:'',
            cityStr:'',
            country:'',
          mail: '',
          createTime: '',
          reason: '',
          status:'',
          businessLicenseUrl:'',//营业执照
          typeName:'',
          showStatusVisible: '', // 是否展示选择审核类型 0的时候展示
            showBtn:false
        },
        status:0
      }
    },
    methods: {
      init(id) {
        this.dataForm.id = id || 0
        this.visible = true
          this.repeatVisible = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            userMemberApplication.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.userId = data.map.userMemberApplication.userId
                this.dataForm.reason = data.map.userMemberApplication.reason
                this.dataForm.createTime = data.map.userMemberApplication.createTime
                this.dataForm.status = parseInt(data.map.userMemberApplication.status)===0?'':parseInt(data.map.userMemberApplication.status)
                  if(this.dataForm.status ===''){
                      this.dataForm.showBtn = true
                  }else {
                      this.dataForm.showBtn = false
                  }
                this.dataForm.showStatusVisible = parseInt(data.map.userMemberApplication.status)
                this.dataForm.businessLicenseUrl = data.map.userMemberApplication.businessLicenseUrl//营业执照
                this.dataForm.type = data.map.userMemberApplication.type
                this.dataForm.typeName = data.map.userMemberApplication.typeName;//行业
                  this.dataForm.name = data.map.userRespDto.name;//姓名
                  this.dataForm.addressName = data.map.userRespDto.addressName;//地址
                  this.dataForm.postalCode = data.map.userRespDto.postalCode;//邮编
                  this.dataForm.mail = data.map.userRespDto.userName;//邮箱
                  this.dataForm.provinceStr = data.map.userRespDto.provinceStr;//省份
                  this.dataForm.cityStr = data.map.userRespDto.cityStr;//城市
                  this.dataForm.country = data.map.userRespDto.country;//城市
              }

            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.repeatVisible = true
            let params = {
              'id': this.dataForm.id || undefined,
              'reason': this.dataForm.reason,
              'status': this.dataForm.status,
              'userId': this.dataForm.userId,
            };
            let tick = !this.dataForm.id ? userMemberApplication.add(params) : userMemberApplication.update(params);
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: this.$t('common.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.repeatVisible = false
              }
            })
          }
        })
      }
    }
  }
</script>
