<template>
  <div style="margin-top: 50px">
    <el-form ref="numberForm" :model="value" label-width="120px"
             size="small">

      <el-form-item :label="$t('manage.commodity.commodityNumberDetail.numberSelectType')"
                    :rules="{required: true, message: $t('manage.commodity.commodityNumberDetail.numberSelectTypeRule'), trigger: 'blur'}"
                    prop="commodity.numberSelectType">
        <el-radio-group v-model="value.commodity.numberSelectType">
          <el-radio :label="1">{{$t('manage.commodity.commodityNumberDetail.numberSelectType1')}}</el-radio>
          <el-radio :label="2">{{$t('manage.commodity.commodityNumberDetail.numberSelectType2')}}</el-radio>
          <el-radio :label="3">{{$t('manage.commodity.commodityNumberDetail.numberSelectType3')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('manage.commodity.commodityNumberDetail.numberInputLabel')"
        v-if="value.commodity.numberSelectType===1"
        :rules="{required: true, message: $t('manage.commodity.commodityNumberDetail.numberInputLabelRule'), trigger: 'blur'}"
        prop="commodity.numberInputLabel">
        <el-input v-model="value.commodity.numberInputLabel"></el-input>
      </el-form-item>

      <template v-if="value.commodity.numberSelectType===3">
        <el-form-item style="text-align: right"
                      v-if="this.value.commodityNumberAttributesArray===null || this.value.commodityNumberAttributesArray.length<2">
          <el-button size="medium" @click="openAddAttributes()" icon="el-icon-plus" type="primary">{{$t('manage.commodity.commodityNumberDetail.addAttributes')}}</el-button>
        </el-form-item>
        <el-form-item v-for="(item,index) in this.value.commodityNumberAttributesArray" :label="item.name" :key="index">
          <el-row>
            <el-col :span="3" v-for="(subItem,subIndex) in item.numberAttributeValueList" :offset="subIndex > 0 ? 2 : 0"
                    :key="subIndex">
              <el-card :body-style="{ padding: '0px' }">
                <span v-html="subItem.name"></span>
              </el-card>
            </el-col>
            <el-button type="danger" size="small" @click="deleteAttributes(index)" icon="el-icon-delete" circle
                       style="float:right"></el-button>
            <el-button type="info" size="small" @click="openAddAttributes(index)" icon="el-icon-edit" circle
                       style="float:right"></el-button>
            <el-button v-if="$ArrayUtil.switchAble(value.commodityNumberAttributesArray,index,+1)"
                       @click="$ArrayUtil.switchOffset(value.commodityNumberAttributesArray,index,+1)" size="small"
                       icon="el-icon-caret-bottom" circle
                       style="float:right"></el-button>
            <el-button v-if="$ArrayUtil.switchAble(value.commodityNumberAttributesArray,index,-1)"
                       @click="$ArrayUtil.switchOffset(value.commodityNumberAttributesArray,index,-1)" size="small"
                       icon="el-icon-caret-top" circle
                       style="float:right"></el-button>
          </el-row>
        </el-form-item>
      </template>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">{{$t('manage.commodity.commodityNumberDetail.handlePrev')}}</el-button>
        <el-button type="primary" size="medium" @click="handleNext">{{$t('manage.commodity.commodityNumberDetail.handleNext')}}</el-button>
      </el-form-item>
    </el-form>
    <commodity-number-attr-add ref="commodityNumberAttrAdd"
                               @handleAddAttributes="handleAddAttributes"></commodity-number-attr-add>
  </div>
</template>

<script>
    import CommodityNumberAttrAdd from './CommodityNumberAttrAdd'

    export default {
        name: 'CommodityAttrDetail',
        components: {CommodityNumberAttrAdd},
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                //编辑模式时是否初始化成功
                hasEditCreated: false,
                editIndex: undefined,
            }
        },
        methods: {
            openAddAttributes(index) {
                this.$nextTick(function () {
                    if (index !== undefined) {
                        this.editIndex = index
                        let obj = this.value.commodityNumberAttributesArray[index]
                        this.$refs['commodityNumberAttrAdd'].init(obj)
                    } else {
                        this.editIndex = undefined
                        this.$refs['commodityNumberAttrAdd'].init()
                    }
                })
            },
            handlePrev() {

                this.$emit('prevStep')
            },
            handleNext() {
                this.$refs['numberForm'].validate((valid) => {
                    if(valid){
                        if (this.value.commodity.numberSelectType === 3) {
                            if (this.value.commodityNumberAttributesArray.length !== 2) {
                                this.$message.warning(this.$t('manage.commodity.commodityNumberDetail.warning'))
                                return;
                            }
                        }
                        this.$emit('nextStep')
                    }
                })
            },
            handleAddAttributes(obj) {
                if (this.editIndex !== undefined) {
                    //修改
                    this.value.commodityNumberAttributesArray.splice(this.editIndex,1, obj)
                } else {
                    //新增
                    this.value.commodityNumberAttributesArray.push(obj)
                }
            },
            deleteAttributes(index) {
                this.$confirm(this.$t('manage.commodity.commodityNumberDetail.confirm'), this.$t('common.tips'), {
                    confirmButtonText: this.$t('common.comfirm'),
                    cancelButtonText:  this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.value.commodityNumberAttributesArray.splice(index, 1)
                }).catch(() => {
                })
            }
        }
    }
</script>

<style scoped>
  .image {
    width: 100%;
    display: block;
  }

</style>
