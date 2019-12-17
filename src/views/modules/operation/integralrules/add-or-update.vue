<template>
  <el-dialog
    :title="$t('common.update')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">

      <el-form-item :label="$t('manage.operation.integralRules.ruleType')" prop="type">
        <el-select v-model="dataForm.ruleType">
          <el-option-group>
            <el-option :value="1" :label="$t('manage.operation.integralRules.integral')"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('manage.operation.integralRules.type')" prop="type" v-if="dataForm.ruleType==1">
        {{changeIntegralType()}}
        <!--        <el-radio-group v-model="dataForm.type" :change="changeIntegralType()">-->
        <!--          <el-radio :label="1">返现规则</el-radio>-->
        <!--          <el-radio :label="2">支付抵扣规则</el-radio>-->
        <!--          <el-radio :label="3">最高抵扣规则</el-radio>-->
        <!--        </el-radio-group>-->
      </el-form-item>
      <el-form-item :label="condition_title" prop="factor" v-if="dataForm.ruleType==1">
        <el-input v-model="dataForm.factor" placeholder="">
          <template slot="append">{{condition_unit}}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="result_title" prop="result" v-if="dataForm.ruleType==1">
        <el-input v-model="dataForm.result" placeholder="">
          <template slot="append">{{result_unit}}</template>
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {integralrules} from '@/action/integralrules'

    export default {
        data() {
            return {
                repeatVisible: false,
                visible: false,
                condition_title: this.$t('manage.operation.integralRules.conditionTitle'),
                condition_unit: this.$t('manage.operation.integralRules.conditionUnit'),
                result_title: this.$t('manage.operation.integralRules.resultTitle'),
                result_unit: this.$t('manage.operation.integralRules.resultUnit'),
                dataForm: {
                    id: 0,
                    type: 1,
                    factor: '',
                    result: '',
                    createTime: '',
                    createSysUserId: '',
                    updateTime: '',
                    updateSysUserId: '',
                    ruleType: 1
                },
                dataRule: {
                    type: [
                        {required: true, message: this.$t('manage.operation.integralRules.typeRule'), trigger: 'blur'}
                    ],
                    factor: [
                        {required: true, message: this.$t('manage.operation.integralRules.factorRule'), trigger: 'blur'}
                    ],
                    result: [
                        {required: true, message: this.$t('manage.operation.integralRules.resultRule'), trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetFields(formName) {
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields();
                }
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true
                this.$nextTick(() => {
                    this.resetFields('dataForm')
                    if (this.dataForm.id) {
                        integralrules.info(this.dataForm.id).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.type = data.integralRules.type
                                this.dataForm.factor = data.integralRules.factor
                                this.dataForm.result = data.integralRules.result
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {

                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.repeatVisible = true;
                        let params = {
                            'id': this.dataForm.id || undefined,
                            'type': this.dataForm.type,
                            'condition': this.dataForm.condition,
                            'result': this.dataForm.result,
                            'ruleType': this.dataForm.ruleType,
                        };
                        let tick = !this.dataForm.id ? integralrules.add(params) : integralrules.update(params);
                        tick.then(({data}) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: this.$t('common.success'),
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false;
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
            changeIntegralType() {
                if (this.dataForm.type === 1) {
                    this.condition_title = this.$t('manage.operation.integralRules.title1');
                    this.condition_unit = this.$t('manage.operation.integralRules.conditionUnit');
                    this.result_title = this.$t('manage.operation.integralRules.resultTitle');
                    this.result_unit =  this.$t('manage.operation.integralRules.resultUnit');
                    this.result = {title: this.$t('manage.operation.integralRules.resultTitle'), unit: this.$t('manage.operation.integralRules.resultUnit')};
                    return this.$t('manage.operation.integralRules.type1');
                } else if (this.dataForm.type === 2) {
                    this.condition_title = this.$t('manage.operation.integralRules.title2');
                    this.condition_unit = this.$t('manage.operation.integralRules.website');
                    this.result_title = this.$t('manage.operation.integralRules.resultTitle');
                    this.result_unit = this.$t('manage.operation.integralRules.resultUnit');
                    return this.$t('manage.operation.integralRules.type2');
                }
            }
        }
    }
</script>
