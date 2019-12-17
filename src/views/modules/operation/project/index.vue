<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">


      <!--      <el-form-item :label="$t('manage.operation.project.logo')" prop="logo">-->
      <!--        <el-upload-->
      <!--          class="avatar-uploader"-->
      <!--          :action="global.uploadUrl"-->
      <!--          :show-file-list="false"-->
      <!--          accept="image/jpeg,image/gif,image/png"-->
      <!--          :on-success="handleAvatarSuccess"-->
      <!--          :before-upload="beforeAvatarUpload">-->
      <!--          <img v-if="dataForm.logo" :src="global.showUrl+dataForm.logo" class="avatar">-->
      <!--          <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      <!--        </el-upload>-->
      <!--&lt;!&ndash;        <el-input v-model="dataForm.companyLogo" placeholder="logo"></el-input>&ndash;&gt;-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="应用名称" prop="name">-->
      <!--        <el-input v-model="dataForm.name" placeholder="应用名称"></el-input>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="邮箱" prop="email">-->
      <!--        <el-input type="email" v-model="dataForm.email" placeholder=""></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('manage.operation.project.address')" prop="address">
        <el-input v-model="dataForm.address" placeholder="" ></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.operation.project.phone')" prop="phone">
        <el-input v-model="dataForm.phone" type="tel"
                  pattern="1[0-9]{3}-[0-9]{3}-[0-9]{4}"></el-input>
      </el-form-item>
      <!--      <el-form-item :label="$t('manage.operation.project.fax')" prop="fax">-->
      <!--        <el-input v-model="dataForm.fax"  type="tel"-->
      <!--                  pattern="1[0-9]{3}-[0-9]{3}-[0-9]{4}"></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('manage.operation.project.email')" prop="email">
        <el-input v-model="dataForm.email" placeholder=""></el-input>
      </el-form-item>

      <el-form-item :label="$t('manage.operation.project.AM')" prop="am">
        <el-time-picker
          is-range
          v-model="dataForm.am"
          range-separator="-"
          format='HH:mm'
          value-format="HH:mm"
          :start-placeholder="$t('manage.operation.project.startPlaceholder')"
          :end-placeholder="$t('manage.operation.project.endPlaceholder')"
          placeholder="">
        </el-time-picker>
      </el-form-item>
      <el-form-item :label="$t('manage.operation.project.PM')" prop="pm">
        <el-time-picker
          is-range
          v-model="dataForm.pm"
          range-separator="-"
          format='HH:mm'
          value-format="HH:mm"
          :start-placeholder="$t('manage.operation.project.startPlaceholder')"
          :end-placeholder="$t('manage.operation.project.endPlaceholder')"
          placeholder="">
        </el-time-picker>
      </el-form-item>
      <!--      <el-form-item :label="$t('manage.operation.project.remark')" prop="remark">-->
      <!--        <el-input type="textarea" v-model="dataForm.remark" placeholder=""></el-input>-->
      <!--      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t("common.comfirm")}}</el-button>
    </span>
  </div>

</template>

<script>
    import {project} from '@/action/project'

    export default {
        data() {
            return {
                startTime:'',
                endTime:'',
                repeatVisible: false,
                visible: false,
                imageUrl: global.showUrl,
                dataForm: {
                    id: 0,
                    logo: '',
                    companyName: '',
                    name: '',
                    fax: '',
                    email: '',
                    address: '',
                    am: [],
                    pm: [],
                    phone: '',
                    remark: '',
                },
                dataRule: {
                    companyLogo: [
                        {
                            required: true,
                            message: this.$t('manage.operation.project.rule.companyLogoRule'),
                            trigger: 'blur'
                        }
                    ],
                    am: [
                        {required: true, message: this.$t('manage.operation.project.rule.timeRule'), trigger: 'blur'}
                    ],
                    pm: [
                        {required: true, message: this.$t('manage.operation.project.rule.timeRule'), trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: this.$t('manage.operation.project.rule.emailRule'), trigger: 'blur'},
                        {type: 'email', message: this.$t('manage.operation.project.rule.emailRule'), trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: this.$t('manage.operation.project.rule.addressRule'), trigger: 'blur'},
                        {min: 3, max: 200, message: this.$t('manage.commodity.commodityInfoDetail.nameRule2'), trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: this.$t('manage.operation.project.rule.phoneRule'), trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: this.$t('manage.operation.project.rule.remarkRule'), trigger: 'blur'}
                    ]
                }
            }
        },
        beforeRouteEnter(to, form, next) {
            next(vm => {
                vm.init();
            })
        },
        methods: {
            init() {
                this.dataForm.id = 1;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields();
                    if (this.dataForm.id) {
                        project.info(this.dataForm.id).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.logo = data.project.logo
                                this.dataForm.companyName = data.project.companyName
                                this.dataForm.name = data.project.name
                                this.dataForm.email = data.project.email
                                this.dataForm.address = data.project.address
                                this.dataForm.phone = data.project.phone
                                this.dataForm.remark = data.project.remark
                                this.dataForm.fax = data.project.fax
                                if(data.project.amWorkTime !== '' && data.project.amWorkTime != null){
                                    this.dataForm.am = data.project.amWorkTime.split(',')
                                }else {
                                    this.dataForm.am = ['08:00','12:00']
                                }
                                if(data.project.pmWorkTime !== '' && data.project.pmWorkTime != null ){
                                    this.dataForm.pm = data.project.pmWorkTime.split(',')
                                }else {
                                    this.dataForm.pm = ['14:00','23:00']
                                }
                                if (data.project.companyLogo) {
                                    this.imageUrl = this.global.showUrl + this.dataForm.companyLogo
                                }

                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                this.repeatVisible = true;
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            'id': this.dataForm.id || undefined,
                            'logo': this.dataForm.logo,
                            'amWorkTime': this.dataForm.am[0]+','+this.dataForm.am[1],
                            'pmWorkTime': this.dataForm.pm[0]+','+this.dataForm.pm[1],
                            'name': this.dataForm.name,
                            'email': this.dataForm.email,
                            'address': this.dataForm.address,
                            'phone': this.dataForm.phone,
                            'remark': this.dataForm.remark
                        };
                        let tick = !this.dataForm.id ? project.add(params) : project.update(params);
                        tick.then(({data}) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: this.$t('common.success'),
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList');
                                        this.repeatVisible = false;
                                    }
                                })
                            } else {
                                this.$message.error(data.msg);
                                this.repeatVisible = false;
                            }
                        })
                    }
                })
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                if (res && res.code === 200) {
                    this.dataForm.logo = res.result.title;
                }
            },
            beforeAvatarUpload(file) {

                return true;
            },
        }
    }
</script>

