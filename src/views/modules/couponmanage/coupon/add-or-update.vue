<template>
  <el-dialog
    :title="!dataForm.id ? $t('common.add') : $t('common.showDet')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-form-item :label="$t('manage.coupon.name')" prop="name">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.name"
                  :placeholder="$t('manage.coupon.name')"></el-input>
      </el-form-item>


      <el-form-item :label="$t('manage.coupon.couponType')" prop="couponType">
        <el-select :disabled="dataForm.id!==0" v-model="dataForm.couponType" placeholder="">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manage.coupon.useStartAt')" prop="useStartAt">
        <el-date-picker
          :disabled="dataForm.id!==0"
          v-model="dataForm.useStartAt"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptionsStart"
          :editable="false"
          :placeholder="$t('manage.coupon.useStartAt')"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item :label="$t('manage.coupon.useEndAt')" prop="useEndAt">
        <el-date-picker
          :disabled="dataForm.id!==0"
          v-model="dataForm.useEndAt"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          :editable="false"
          :picker-options="pickerOptionsEnd"

          :placeholder="$t('manage.coupon.useEndAt')"
        >
        </el-date-picker>
      </el-form-item>
      <!--          :picker-options="pickerOptions"-->
      <!--<el-form-item :label="$t('manage.coupon.totalNum')" prop="totalNum">-->
      <!--<el-input v-model="dataForm.totalNum" :placeholder="$t('manage.coupon.totalNum')"></el-input>-->
      <!--</el-form-item>-->
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('manage.coupon.condition')" prop="regulation">
            <el-input :disabled="dataForm.id!==0" v-model="dataForm.regulation"
                      :placeholder="$t('manage.coupon.condition')">
              <template slot="prepend">€</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('manage.coupon.result')" prop="result">
            <el-input :disabled="dataForm.id!==0" v-model="dataForm.result" :placeholder="$t('manage.coupon.result')">
              <template slot="prepend">€</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('manage.coupon.instructions')" prop="instructions">
        <el-input :disabled="dataForm.id!==0" v-model="dataForm.instructions"
                  :placeholder="$t('manage.coupon.instructionsPla')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('manage.coupon.general')" prop="general">
        <el-radio-group :disabled="dataForm.id!==0" v-model="dataForm.general">
          <el-radio :label="0">{{$t("manage.coupon.no")}}</el-radio>
          <el-radio :label="1">{{$t("manage.coupon.yes")}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.general===0" :label="$t('manage.coupon.comodityId')" prop="commodityId">

        <el-select :disabled="dataForm.id!==0" v-model="dataForm.commodityId" multiple>
          <el-option
            v-for="item in comodityOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--是否全部用户-->
      <el-form-item :label="$t('manage.coupon.isAllPeople')" prop="general">
        <el-radio-group :disabled="dataForm.id!==0" v-model="dataForm.isAllPeople">
          <el-radio :label="0">{{$t("manage.coupon.no")}}</el-radio>
          <el-radio :label="1">{{$t("manage.coupon.yes")}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataForm.isAllPeople===0" :label="$t('manage.coupon.userId')" prop="userId">
        <!--        <el-select :disabled="dataForm.id!==0" v-model="dataForm.userId"  @change="changeFun" multiple >-->
        <!--          <el-option-->
        <!--            v-for="item in userOptions"-->
        <!--            :key="item.id"-->
        <!--            :label="item.nick_name"-->
        <!--            :value="item.id">-->
        <!--          </el-option>-->
        <!--        </el-select>-->
        <el-select
          :placeholder="$t('manage.coupon.search')"
          :disabled="dataForm.id!==0"
          v-model="dataForm.userId"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder=""
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in remoteOptions"
            :key="item.id"
            :label="item.userName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('manage.coupon.image')" prop="image">
        <el-upload :disabled="dataForm.id!==0"
                   class="avatar-uploader"
                   :action="this.global.uploadUrl"
                   :show-file-list="false"
                   accept="image/jpeg,image/gif,image/png"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
          <img v-if="dataForm.image" :src="global.showUrl+dataForm.image" class="avatar"
               style="width: 178px;height: 178px">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button v-if="dataForm.id==0" type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t("common.comfirm")}}</el-button>
      <el-button v-else type="primary" @click="visible = false">{{$t("common.close")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {coupon} from '@/action/coupon'
    export default {
        data() {
            // let validateTotalNum = (rule, value, callback) => {
            //   let num = /^[1-9]\d*$/;
            //   console.log(num.test(value))
            //   if (!num.test(value)) {
            //     callback(new Error(this.$t('manage.coupon.validate.mustNum')));
            //   }else{
            //     callback();
            //   }
            // };
            let validateName = (rule, value, callback) => {
                if (this.checkSpecificKey(value)) {
                    callback();
                } else {
                    callback(new Error(this.$t('manage.coupon.validate.wrongName')))
                }
            };
            //两位有效数字
            const validateTotalNum = (rule, value, callback) => {
                if (value == "" || value == "0.00") {
                    callback(new Error(this.$t('manage.coupon.validate.numRule')));
                } else {
                    let reg = /^[0-9]+([.]{1}[0-9]{0,2})?$/;
                    if (!reg.test(value)) {
                        callback(new Error(this.$t('manage.coupon.validate.numRule')));
                    } else {
                        callback();
                    }
                }
            };

            return {
                pickerOptionsStart: {
                    disabledDate: time => {
                        if (this.dataForm.useEndAt) {
                            return time.getTime() > new Date(this.dataForm.useEndAt).getTime() || time.getTime() < Date.now() - 8.64e7;
                        } else {
                            return this.dealDisabledDate(time)
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: (time) => {
                        if (this.dataForm.useStartAt) {
                            return time.getTime() < new Date(this.dataForm.useStartAt).getTime()
                        } else {
                            return this.dealDisabledDate(time)
                        }
                    }
                },
                visible: false,
                repeatVisible: false,
                // 优惠卷类型数组
                options: [],
                //商品类型
                comodityOptions: [],
                userOptions: [],
                dataForm: {
                    id: 0,
                    name: '',
                    couponType: '',
                    useStartAt: '',
                    useEndAt: '',
                    totalNum: '',
                    regulation: '',
                    result: '',
                    general: 1,
                    isAllPeople: 1,
                    commodityId: [],
                    userId: [],
                    image: '',   //图片名字
                    instructions: '',
                },
                remoteOptions: [],
                list: [],
                loading: false,
                dataRule: {
                    name: [
                        {required: true, message: this.$t('manage.coupon.validate.nameRule'), trigger: 'blur'},
                        {min: 2, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    instructions: [
                        {required: true, message: this.$t('manage.coupon.validate.instructionsRule'), trigger: 'blur'},
                    ],
                    couponType: [
                        {required: true, message: this.$t('manage.coupon.validate.couponTypeRule'), trigger: 'blur'}
                    ],
                    useStartAt: [
                        {required: true, message: this.$t('manage.coupon.validate.useStartAtRule'), trigger: 'blur'},
                        // { validator: validateTotalDate, trigger: 'blur' }
                    ],
                    useEndAt: [
                        {required: true, message: this.$t('manage.coupon.validate.useEndAtRule'), trigger: 'blur'},
                        // { validator: validateTotalDate, trigger: 'blur' }
                    ],
                    regulation: [
                        {required: true, message: this.$t('manage.coupon.validate.conditionRule'), trigger: 'blur'},
                        {validator: validateTotalNum, trigger: 'blur'}
                    ],
                    result: [
                        {required: true, message: this.$t('manage.coupon.validate.resultRule'), trigger: 'blur'},
                        {validator: validateTotalNum, trigger: 'blur'}
                    ],
                    general: [
                        {required: true, message: this.$t('manage.coupon.validate.generalRule'), trigger: 'blur'}
                    ],
                    image: [
                        {required: true, message: this.$t('manage.coupon.validate.imageRule'), trigger: 'blur'}
                    ],
                    userId: [
                        {required: true, message: this.$t('manage.coupon.validate.userIdRule'), trigger: 'blur'}
                    ],
                    commodityId: [
                        {required: true, message: this.$t('manage.coupon.validate.commodityIdRule'), trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            init(id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.repeatVisible = false
                this.clearSelect()
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields();
                    if (this.dataForm.id) {
                        coupon.info(this.dataForm.id).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.name = data.coupon.name
                                this.dataForm.couponType = parseInt(data.coupon.couponType)
                                this.dataForm.useStartAt = data.coupon.useStartAt
                                this.dataForm.useEndAt = data.coupon.useEndAt
                                this.dataForm.deleteStatus = data.coupon.deleteStatus
                                this.dataForm.surplusNum = data.coupon.surplusNum
                                this.dataForm.totalNum = data.coupon.totalNum
                                this.dataForm.regulation = data.coupon.regulation
                                this.dataForm.result = data.coupon.result
                                this.dataForm.general = data.coupon.general
                                this.dataForm.image = data.coupon.image
                                this.dataForm.isAllPeople = data.coupon.generalPeople
                                this.dataForm.instructions = data.coupon.instructions
                                // this.dataForm.userId = data.coupon.userName
                                for (let i = 0; i < data.coupon.userName.length; i++) {
                                    this.dataForm.userId.push(data.coupon.userName[i].name)
                                }
                                this.dataForm.commodityId.length = 0
                                for (let i = 0; i < data.coupon.commodityName.length; i++) {
                                    this.dataForm.commodityId.push(data.coupon.commodityName[i].name)
                                }
                            }
                        })
                    }else {
                        this.dataForm.general = 1
                        this.dataForm.userId.length = 0
                        this.dataForm.isAllPeople = 1
                        this.getCouponType();
                        this.getCommodityId();
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.repeatVisible = true;
                        var params = {
                            'id': this.dataForm.id || undefined,
                            'name': this.dataForm.name,
                            'couponType': this.dataForm.couponType,
                            'useStartAt': this.dataForm.useStartAt,
                            'useEndAt': this.dataForm.useEndAt,
                            'deleteStatus': this.dataForm.deleteStatus,
                            'totalNum': this.dataForm.totalNum,
                            'regulation': this.dataForm.regulation,
                            'result': this.dataForm.result,

                            // 商品id
                            'commodityId': this.dataForm.commodityId,
                            // userID
                            'userId': this.dataForm.userId,
                            'general': this.dataForm.general,
                            'generalPeople': this.dataForm.isAllPeople,
                            'image': this.dataForm.image,
                            'instructions': this.dataForm.instructions,
                        };
                        var tick = !this.dataForm.id ? coupon.add(params) : coupon.update(params)
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
            },
            beforeAvatarUpload(file) {
                return true;
            },
            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                if (res && res.code === 200) {
                    this.dataForm.image = res.result.title;
                }
            },
            // 单独处理时间的函数
            dealDisabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7;
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
            //获取优惠卷类型数据
            getCouponType() {
                coupon.getCouponType().then(({data}) => {
                    if (data && data.code === 200) {
                        this.options = data.list
                    } else {
                    }
                })
            },
            //获取商品类型数据
            getCommodityId() {
                this.dataForm.commodityId.length = 0
                coupon.getCommodityId().then(({data}) => {
                    if (data && data.code === 200) {
                        this.comodityOptions = data.list
                    } else {
                    }
                })
            },
            //获取用户列表
            getUserList() {
                coupon.getUserList().then(({data}) => {
                    if (data && data.code === 200) {
                        this.userOptions = data.list
                    } else {
                    }
                })
            },
            //清空下拉框
            clearSelect() {
                this.dataForm.commodityId.length = 0
                this.dataForm.userId.length = 0
                this.comodityOptions.length = 0
            },
            //远程搜素
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        coupon.getUserListByName({name: query}).then(({data}) => {
                            if (data && data.code === 200) {
                                this.loading = false;
                                this.remoteOptions = data.list;
                            }
                        })
                    }, 100);
                } else {
                    this.remoteOptions = [];
                }
            }
        },

        mounted() {

        }
    }
</script>
