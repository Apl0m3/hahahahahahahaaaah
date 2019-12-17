<template>
  <el-dialog
    :title="$t('manage.usermanage.userdesignerapplication.detail.title')"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">
    <el-steps :active="active" finish-status="success" v-if="isEdit">
      <el-step :title="item.title" :icon="item.icon" v-for="item in stepData" :key="item.index"></el-step>
    </el-steps>
    <!-- *********************************************   -->
    <el-row class="active0" v-show="active === 0">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="150px">
        <!--        用户名-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.name')">
         <span v-html="name"></span>
        </el-form-item>
        <!--        邮箱-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.email')">
          <span v-html="userName"></span>
        </el-form-item>
        <!--        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.phone')">-->
        <!--          {{phone}}-->
        <!--        </el-form-item>-->
        <!--        地址-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.address')">
          <span v-html="address"></span>
        </el-form-item>
        <!--        省份-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.province')">
         <span v-html="province"></span>
        </el-form-item>
        <!--        城市-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.city')">
          <span v-html="city"></span>
        </el-form-item>
        <!--        账号-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.bankAccount')">
         <span v-html="bankAccount"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.bankName')">
          <span v-html="bankName"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.bankUserName')">
         <span v-html="bankUserName"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.operateTypeNames')">
          <span v-html="operateTypeNames"></span>
        </el-form-item>
        <!--        相关设计案例-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.applicationFiles')">
          <!-- 这里循环展示图片 -->
          <span v-for="file in applicationFiles">
		          <img width="100px" height="100px" :src="global.showUrl+file">
		        </span>
        </el-form-item>


        <!--        下载简历-->

        <!--        审核-->
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.audit')" prop="status"
                      v-if="showStatusVisible === 0">
          <el-select v-model="dataForm.status" @change="changeFun">
            <el-option :label="$t('manage.usermanage.userdesignerapplication.detail.applyPass')" @click="nextClick()"
                       :value="1">
              {{$t('manage.usermanage.userdesignerapplication.detail.applyPass')}}
            </el-option>
            <el-option :label="$t('manage.usermanage.userdesignerapplication.detail.applyFailure')" :value="2">
              {{$t('manage.usermanage.userdesignerapplication.detail.applyFailure')}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStatusVisible === 2 || dataForm.status === 2"
                      :label="$t('manage.usermanage.userdesignerapplication.detail.failureReason')" prop="reason">
          <el-input v-if="showStatusVisible !== 0" type="textarea" :rows="2" v-model="dataForm.reason"
                    disabled="disabled"></el-input>
          <el-input v-if="showStatusVisible === 0" type="textarea" :rows="2" v-model="dataForm.reason"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- *********************************************   -->
    <el-row class="active0" v-show="active === 1">
      <el-form :model="value" ref="secondForm" :rules="rules" label-width="0px" style="width: 80%" size="small">
        <template v-for="(item,index) in value.tableData">
          <el-row>
            <el-col :span="7">
              <el-form-item :label="$t('manage.usermanage.usersupplierapplication.detail.typeName')"
                            label-width="100px">
                <span>{{item.name}}</span>
              </el-form-item>

            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('manage.usermanage.usersupplierapplication.detail.commodityCommission')"
                            label-width="100px">
                <span>{{item.commission}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10" >
              <el-form-item :label="$t('manage.usermanage.usersupplierapplication.detail.busCommission')"
                            label-width="100px" :prop="'tableData.'+index+'.designCommission'"
                            :rules="rule">
                <el-input v-model.trim="item.designCommission"
                          :placeholder="$t('manage.usermanage.usersupplierapplication.detail.busCommissionPlaceholder')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </el-row>
    <!-- *********************************************   -->
    <span slot="footer" class="dialog-footer">
          <el-button v-if="this.active !== 0" type="primary" plain size="medium"
                     @click="preClick()">{{preTile}}
          </el-button>
		      <el-button @click="downloadHandler()">{{$t('manage.usermanage.userdesignerapplication.detail.downloadResume')}}</el-button>
		      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
		      <el-button type="primary" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>
<style>

</style>

<script>
    import {userdesignerapplication} from '@/action/userdesignerapplication'

    export default {
        props: {
            isEdit: {
                type: Boolean,
                // default: true
            }
        },
        data() {
            return {
                rule: {
                    required: true,
                    validator: (rule, value, callback) => {
                        //通过rule获取当前商品的id rule.field=tableData.0.commission
                        //审核失败不进入步骤2判断
                        if (this.dataForm.status !== 2) {
                            let str = rule.field;
                            let strs = str.split('.');
                            let index = strs[1];
                            //获取下标 通过下标找到商品id
                            let commodityTypeId = this.value.tableData[index].commodityTypeId;
                            var commission;
                            //获得对应商品id的佣金 和输入的佣金判断
                            for (let i = 0; i < this.commissionDto.length; i++) {
                                if (this.commissionDto[i].commodityTypeId === commodityTypeId) {
                                    commission = this.commissionDto[i].commission;
                                }
                            }
                            if (parseInt(value) > parseInt(commission)) {
                                callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.tooMuchCommissionError') + commission));
                            }
                            if (value == "" || value == "0.00") {
                                callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')));
                            } else {
                                let reg = /^[0-9]+([.]{1}[0-9]{0,2})?$/;
                                if (!reg.test(value)) {
                                    callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')));
                                } else {
                                    callback();
                                }
                            }
                        } else {
                            callback();
                        }

                    },
                    trigger: "blur"
                },
                //步骤条
                active: 0, // 控制步骤条及填写条目的显示
                stepData: [{
                    index: 0,
                    title: this.$t('manage.usermanage.userdesignerapplication.detail.step1'),
                    icon: 'el-icon-edit'
                },
                    {
                        index: 1,
                        title: this.$t('manage.usermanage.userdesignerapplication.detail.step2'),
                        icon: 'el-icon-edit'
                    },
                ],
                nextTile: this.$t('manage.usermanage.userdesignerapplication.detail.nextTile'),
                preTile: this.$t('manage.usermanage.userdesignerapplication.detail.preTile'),
                multipleSelection: [],
                visible: false,
                name: '', // 用户名
                userName: '', // 邮箱
                userId:'',
                phone: '', // 手机号码
                address: '', // 地址
                province:'',//省份
                city:'',//城市
                show: true,
                value: {
                    tableData: [],
                },
                // 银行账号
                bankAccount: '',
                //开户行
                bankName: '',
                //开户人
                bankUserName: '',
                commissionDto: [],//查询包含佣金的dto 和tableData输入的佣金对比
                operateTypeNames: '', // 擅长的软件
                applicationFiles: [], // 相关设计案例url路径数组
                showStatusVisible: '', // 是否展示选择审核类型 0的时候展示
                resumeUrl: '', // 简历下载地址
                dataForm: {
                    id: 0, // 设计师申请表id
                    userId: '', // 用户id
                    status: '', // 审核状态
                    reason: '', // 失败原因

                },
                dataRule: {
                    reason: [
                        {
                            required: true,
                            message: this.$t('manage.usermanage.userdesignerapplication.detail.reasonRule'),
                            trigger: 'blur'
                        }
                    ]
                },
                rules: {}
            }
        },


        methods: {
            //对话框关闭 回到步骤一 清空表格
            closeDialog() {
                let _that = this;
                _that.active = 0
            },

            //获取商品分类列表
            getTypeList() {
                userdesignerapplication.getTypeList().then(({data}) => {
                    if (data && data.code === 200) {
                        this.value.tableData = data.typeList
                    } else {
                        // console.log(this.$t('common.wrong'))
                    }
                })
            },
            getcommissionDto() {
                userdesignerapplication.getcommissionDto().then(({data}) => {
                    if (data && data.code === 200) {
                        this.commissionDto = data.commissionDto;
                    } else {
                        // console.log(this.$t('common.wrong'))
                    }
                })
            },
            checkCommission(val) {
            },
            nextClick() {
                var _that = this;
                if (_that.active < 3) {
                    _that.active++;
                } else {
                    _that.active = 0;
                }
            },
            preClick() {
                this.dataForm.status = ''
                let _that = this;
                if (_that.active > 0) {
                    _that.active--;
                } else {
                    _that.active = 0;
                }
            },
            changeFun(val) {
                if (val === 1) {
                    this.nextClick();
                }
            },
            // Submit(val) {
            //   let _that = this;
            //   this.$refs['Form'].validate((valid) => {
            //     // 校验通过后，你想实现的下一步操作
            //   } else {
            //     _that.focusToError();
            //   }
            // },
            init(id, val) {
                if (val !== null) {
                    this.show = false
                }
                this.dataForm.id = id
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    // this.tableData=[];
                    if (this.dataForm.id) {
                        userdesignerapplication.info(this.dataForm.id).then(({data}) => {
                            if (data && data.code === 200) {
                                this.name = data.userRespDto.name
                                this.userName = data.userRespDto.userName
                                this.address = data.userRespDto.addressName
                                this.city = data.userRespDto.cityStr
                                this.province = data.userRespDto.provinceStr
                                if(data.userBank != null){
                                    this.bankAccount = data.userBank.bankAccount;
                                    this.bankName = data.userBank.bankName;
                                    this.bankUserName = data.userBank.bankUserName;
                                }
                                this.applicationFiles = data.userDesignerApplication.applicationFiles
                                this.operateTypeNames = data.userDesignerApplication.operateTypeNames
                                this.dataForm.userId = data.userDesignerApplication.userId
                                this.showStatusVisible = data.userDesignerApplication.status
                                this.dataForm.reason = data.userDesignerApplication.reason
                                this.resumeUrl = data.userDesignerApplication.resumeUrl
                                this.getTypeList();
                                this.getcommissionDto();
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                if (this.showStatusVisible === 1 || this.showStatusVisible === 2) {
                    this.visible = false
                } else {
                    this.$refs['dataForm'].validate((valid) => {
                        if (valid) {
                            this.$refs['secondForm'].validate((valid) => {
                                if (valid) {
                                    this.submit(this.value.tableData)
                                }
                            })

                        }
                    })
                }
            },
            submit(val) {
                let params = {
                    'id': this.dataForm.id || undefined,
                    'userId': this.dataForm.userId,
                    'status': this.dataForm.status,
                    'reason': this.dataForm.reason,
                    'commissionDto': val
                }
                var tick = !this.dataForm.id ? userdesignerapplication.add(params) : userdesignerapplication.update(params)
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
                    }
                })
            },
            // 下载简历
            downloadHandler() {
                window.location.href = this.global.showUrl + this.resumeUrl
            }
        }
    }
</script>
