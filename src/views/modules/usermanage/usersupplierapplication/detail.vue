<template>
  <el-dialog
    :title="$t('manage.usermanage.usersupplierapplication.detail.title')"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">

<!--    <el-steps :active="active" finish-status="success">-->
<!--      <el-step :title="item.title" :icon="item.icon" v-for="item in stepData" :key="item.index"></el-step>-->
<!--    </el-steps>-->

    <!-- *********************步骤一************************   -->
    <el-row class="active0" >
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.companyName')">
         <span v-html="companyName"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.url')">
          <span v-html="companyWebsite"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.address')">
          <span v-html="address"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.postCode')">
          <span v-html="postalCode"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.province')">
          <span v-html="provinceStr"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.city')">
         <span v-html="cityStr"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.country')">
          <span v-html="country"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.name')">
         <span v-html="name"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.phone')">
         <span v-html="phone"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.supplyCommodity')">
         <span v-html="supplyProducts"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.bankAccount')">
         <span v-html="bankAccount"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.bankName')">
         <span v-html="bankName"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.usersupplierapplication.bankUserName')">
          <span v-html="bankUserName"></span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.relatedPrice')">
          <!-- 这里循环展示图片 -->
          <span   v-for="file in applicationFiles">
          <img   v-if="fileJudge" width="100px" height="100px" :src="global.showUrl+file">
            <el-button v-else :disabled="downloadFileVisible" @click="downloadFile(file)">下载报价表</el-button>
         </span>
        </el-form-item>
        <el-form-item :label="$t('manage.usermanage.userdesignerapplication.detail.audit')" prop="status"
                      v-if="showStatusVisible === 0">
          <el-select v-model="dataForm.status" >
            <el-option :label="$t('manage.usermanage.userdesignerapplication.detail.applyPass')" :value="1"
                       @click="nextClick()">{{$t('manage.usermanage.userdesignerapplication.detail.applyPass')}}
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
    <!--      步骤2-->
<!--    <el-row class="active0" v-show="active === 1">-->
<!--      <el-form :model="value" ref="secondForm" label-width="0px" style="width: 80%" size="small">-->
<!--        <template v-for="(item,index) in value.tableData">-->
<!--          <el-row>-->
<!--            <el-col :span="3">-->
<!--              {{item.name}}-->
<!--            </el-col>-->
<!--            <el-col :span="10" style="margin-left: 20px">-->
<!--            <el-form-item :label="$t('manage.usermanage.usersupplierapplication.detail.busCommission')"-->
<!--                          label-width="100px" :prop="'tableData.'+index+'.commission'"-->
<!--                          :rules="rule">-->
<!--&lt;!&ndash;              <el-input v-model.trim="item.commission"&ndash;&gt;-->
<!--&lt;!&ndash;                        :placeholder="$t('manage.usermanage.usersupplierapplication.detail.busCommissionPlaceholder')"></el-input>&ndash;&gt;-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          </el-row>-->
<!--        </template>-->
<!--      </el-form>-->
<!--    </el-row>-->
    <!-- *********************************************   -->

    <span slot="footer" class="dialog-footer">
      <el-button v-if="this.active !== 0" type="primary" plain size="medium"
                 @click="preClick()">{{preTile}}
          </el-button>
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {usersupplierapplication} from '@/action/usersupplierapplication'

    export default {
      props: {
        isEdit: {
          type: Boolean
                // default: true
        }
      },

      data () {
        return {
          rule: {
            required: true,
            validator: (rule, value, callback) => {
                        // 通过rule获取当前商品的id rule.field=tableData.0.commission
              let str = rule.field
              let strs = str.split('.')
              let index = strs[1]
                    // 获取下标 通过下标找到商品id
              let commodityTypeId = this.value.tableData[index].commodityTypeId
              var commission
                    // 获得对应商品id的佣金 和输入的佣金判断
              for (let i = 0; i < this.commissionList.length; i++) {
                if (this.commissionList[i].commodityTypeId === commodityTypeId) {
                  commission = this.commissionList[i].commission
                }
              }
              if (parseInt(value) > parseInt(commission)) {
                callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.tooMuchCommissionError') + commission))
              }
              if (value == '' || value == '0.00') {
                callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')))
              } else {
                let reg = /^[0-9]+([.]{1}[0-9]{0,2})?$/
                if (!reg.test(value)) {
                  callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')))
                } else {
                  callback()
                }
              }
            },
            trigger: 'blur'
          },
                // 步骤条
          active: 0, // 控制步骤条及填写条目的显示

          nextTile: this.$t('manage.usermanage.userdesignerapplication.detail.nextTile'),
          preTile: this.$t('manage.usermanage.userdesignerapplication.detail.preTile'),
          tableData: [], // 表格数据
          multipleSelection: [], // 提交表格数组
          visible: false,
          fileJudge: true,
          downloadFileVisible: false,
          address: '', // 地址
          applicationFiles: [], // 相关报价表url路径数组
          showStatusVisible: '', // 是否展示选择审核类型 0的时候展示
          companyName: '', // 公司名字
          companyWebsite: '', // 公司网站
          supplyProducts: '', // 供应产品
          postalCode: '', // 邮编
          provinceStr: '', // 省份
          cityStr: '', // 城市
          country: '', // 国家
          name: '', // 联系人姓名
          userId: '',
          phone: '', // 电话
          bankAccount: '', // 银行账号
          bankName: '', // 开户行
          bankUserName: '', // 开户人
          dataForm: {
            id: 0, // 供应商申请表id
            status: '', // 审核状态
            reason: ''
          },
          value: {
            tableData: []
          },
          commissionList: []// 查询包含佣金的dto 和tableData输入的佣金对比
        }
      },
      methods: {
        closeDialog () {
          let _that = this
          _that.active = 0
        },
        nextClick () {
          var _that = this
            // console.log(_that.active);
          if (_that.active < 3) {
            _that.active++
                // console.log(_that.active);
          } else {
            _that.active = 0
          }
        },
        preClick () {
          this.dataForm.status = ''
          let _that = this
            // console.log(_that.active);
          if (_that.active > 0) {
            _that.active--
                // console.log(_that.active);
          } else {
            _that.active = 0
          }
        },
            // changeFun(val) {
            //     if (val === 1) {
            //         this.nextClick();
            //     }
            // },
        init (id) {
          this.dataForm.id = id
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.id) {
              usersupplierapplication.info(this.dataForm.id).then(({data}) => {
                this.getProList(id)
                this.getProListCommission(id)
                if (data && data.code === 200) {
                  this.applicationFiles = data.userSupplierApplication.applicationFiles
                  if (this.applicationFiles && this.applicationFiles.length > 0) {
                    let  file=this.applicationFiles[0]
                    this.checkFileType1(file)
                    console.log(file)
                  }
                  this.showStatusVisible = data.userSupplierApplication.status
                  this.companyName = data.userSupplierApplication.companyName
                  this.companyWebsite = data.userSupplierApplication.companyWebsite
                  this.name = data.userSupplierApplication.name
                  this.userId = data.userSupplierApplication.userId
                  this.phone = data.userSupplierApplication.phone
                  this.supplyProducts = data.userSupplierApplication.supplyProducts
                  this.address = data.userRespDto.addressName
                  this.postalCode = data.userRespDto.postalCode
                  this.provinceStr = data.userRespDto.provinceStr
                  this.cityStr = data.userRespDto.cityStr
                  this.country = data.userRespDto.country
                  this.dataForm.reason = data.userSupplierApplication.reason
                  if (data.userBank != null) {
                    this.bankAccount = data.userBank.bankAccount
                    this.bankName = data.userBank.bankName
                    this.bankUserName = data.userBank.bankUserName
                  }
                }
              })
            }
          })
        },
            // 表单提交
        dataFormSubmit () {
          if (this.showStatusVisible === 1 || this.showStatusVisible === 2) {
            this.visible = false
          } else {
            this.$nextTick(() => {
              this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                  if (valid) {
                    this.submit()
                  }
                }
              })
            })
          }
        },
        submit () {
          let params = {
            'id': this.dataForm.id || undefined,
            'userId': this.userId,
            'status': this.dataForm.status,
            'reason': this.dataForm.reason
          }
          let tick = !this.dataForm.id ? usersupplierapplication.add(params) : usersupplierapplication.update(params)
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
            // 获取商品分类列表 不带Commission
        getProList (id) {
          usersupplierapplication.getProList(id).then(({data}) => {
            if (data && data.code === 200) {
              this.value.tableData = data.typeList
            } else {
            }
          })
        },
            // 获取商品分类列表 带Commission
        getProListCommission (id) {
          usersupplierapplication.getProListCommission(id).then(({data}) => {
            if (data && data.code === 200) {
              this.commissionList = data.proListCommission
            } else {
            }
          })
        },
        downloadFile(url){
          this.downloadFileVisible=true
          window.location.href=this.global.showUrl+url
          setTimeout(() => {
            this.downloadFileVisible = false;
          }, 500);
    },
        checkFileType1(url) {
          let imageUrl=url
          const index = url.indexOf('.')// （考虑严谨用lastIndexOf(".")得到）得到"."在第几位
          url = url.substring(index)// 截断"."之前的，得到后缀
          if ( url === '.png' ||  url === '.jpg' || url === '.jpeg') { // 根据后缀，判断是否符合图片格式
           this.fileJudge=true
          }else {
            this.fileJudge=false
          }
        },
      }
    }
</script>
