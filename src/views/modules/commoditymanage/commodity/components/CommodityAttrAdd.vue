<template>
  <!--新增或修改-->
  <el-dialog
    :title="$t('common.edit')"
    :close-on-click-modal="false"
    :before-close="close"
    :visible.sync="visible">
    <el-form :model="newCommodityAttributes" ref="commodityAttrAddForm" label-width="120px"
             size="small">
      <el-form-item
        :label="$t('manage.commodity.commodityAttrAdd.name')"
        :rules="[{required: true, message: $t('manage.commodity.commodityAttrAdd.nameRule1'), trigger: 'blur'},{min:1,max:200, message: $t('manage.commodity.commodityAttrAdd.nameRule2'), trigger: 'blur'}]"
        prop="name">
        <el-input v-model="newCommodityAttributes.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityAttrAdd.category')"
                    :rules="{required: true, message: $t('manage.commodity.commodityAttrAdd.categoryRule'), trigger: 'blur'}"
                    prop="category">
        <el-radio-group v-model="newCommodityAttributes.category">
          <el-radio :label="1" @change="newCommodityAttributes.type=2">{{$t('manage.commodity.commodityAttrAdd.category1')}}</el-radio>
          <el-radio :label="2" @change="newCommodityAttributes.type=2">{{$t('manage.commodity.commodityAttrAdd.category2')}}</el-radio>
          <el-radio :label="3" @change="newCommodityAttributes.type=2">{{$t('manage.commodity.commodityAttrAdd.category3')}}</el-radio>
          <el-radio :label="4" @change="newCommodityAttributes.type=1">{{$t('manage.commodity.commodityAttrAdd.category4')}}</el-radio>
          <el-radio :label="5" @change="newCommodityAttributes.type=1">{{$t('manage.commodity.commodityAttrAdd.category5')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityAttrAdd.type')" prop="type">
        <el-radio-group v-model="newCommodityAttributes.type">
          <!--<el-radio :label="0">默认</el-radio>-->
          <el-radio :label="1" v-if="newCommodityAttributes.category && (newCommodityAttributes.category===4 || newCommodityAttributes.category===5)">{{$t('manage.commodity.commodityAttrAdd.type1')}}</el-radio>
          <el-radio :label="2" v-if="!(newCommodityAttributes.category===4 || newCommodityAttributes.category===5)" @change="changeType()">{{$t('manage.commodity.commodityAttrAdd.type2')}}</el-radio>
          <el-radio :label="3" v-if="!(newCommodityAttributes.category===4 || newCommodityAttributes.category===5)" @change="changeType()">{{$t('manage.commodity.commodityAttrAdd.type3')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--广告-->
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('manage.commodity.commodityAttrAdd.quantity')"
                        v-if="newCommodityAttributes.category===4 || newCommodityAttributes.category===5"
                        :rules="{required: true, message: $t('manage.commodity.commodityAttrAdd.quantityRule'), trigger: 'blur'}"
                        prop="quantity">
            <el-input-number
              v-model="newCommodityAttributes.quantity"
              :min="1"
              :max="10000000000"
              :placeholder="$t('manage.commodity.commodityAttrAdd.quantityPla')"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manage.commodity.commodityAttrAdd.amount')"
                        v-if="newCommodityAttributes.category===4 || newCommodityAttributes.category===5"
                        :rules="{required: true, message: $t('manage.commodity.commodityAttrAdd.amountPla'), trigger: 'blur'}"
                        prop="amount">
            <el-input-number
              v-model="newCommodityAttributes.amount"
              :min="0"
              :max="100000000"
              :placeholder="$t('manage.commodity.commodityAttrAdd.amountPla')"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manage.commodity.commodityAttrAdd.factoryPrice')"
                        v-if="newCommodityAttributes.category===4 || newCommodityAttributes.category===5"
                        :rules="{required: true, message: $t('manage.commodity.commodityAttrAdd.factoryPriceRule'), trigger: 'blur'}"
                        prop="factoryPrice">
            <el-input-number
              v-model="newCommodityAttributes.factoryPrice"
              :min="0"
              :placeholder="$t('manage.commodity.commodityAttrAdd.quantityPla')"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        :label="$t('manage.commodity.commodityAttrAdd.selectType')"
        v-if="newCommodityAttributes.type===2"
        :rules="{required: true, message:$t('manage.commodity.commodityAttrAdd.selectTypeRule'), trigger: 'blur'}"
        prop="selectType">
        <el-radio-group v-model="newCommodityAttributes.selectType">
          <el-radio :label="0">{{$t('manage.commodity.commodityAttrAdd.selectType0')}}</el-radio>
          <el-radio :label="1">{{$t('manage.commodity.commodityAttrAdd.selectType1')}}</el-radio>
          <el-radio :label="2">{{$t('manage.commodity.commodityAttrAdd.selectType2')}}</el-radio>
          <el-radio :label="3">{{$t('manage.commodity.commodityAttrAdd.selectType3')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityAttrAdd.remark')">
        <el-input
          :autoSize="true"
          v-model="newCommodityAttributes.remark"
          type="textarea"
          maxlength="200"
          show-word-limit
          :placeholder="$t('manage.commodity.commodityAttrAdd.remarkPla')"></el-input>
      </el-form-item>
      <!--动态添加属性值-->
      <template v-if="newCommodityAttributes.type !== 1">
        <el-form-item style="text-align: center">{{$t('manage.commodity.commodityAttrAdd.value')}}</el-form-item>
        <commodity-attr-value :params="{category:newCommodityAttributes.category,
                                        type:newCommodityAttributes.type,
                                        selectType:newCommodityAttributes.selectType}"
                              v-model="newCommodityAttributes.attributeValueList"/>
      </template>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <!--取消--><el-button @click="close()">{{$t('common.cancel')}}</el-button>
      <!--确认--><el-button type="primary" @click="handleAddAttributes()" :disabled="repeatVisible">{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import CommodityAttrValue from './CommodityAttrValue'

  export default {
    name: 'CommodityAttrAdd',
    components: {CommodityAttrValue},
    data () {
      return {
        visible: false,
        repeatVisible: false,
        isEdit: false,
        newCommodityAttributes: {
          name: '',
          category: 1,
          type: 1,
          selectType: 0,
          quantity: 1,
          amount: undefined,
          factoryPrice: undefined,
          remark: '',
          attributeValueList: [
            {
              recommend: 0,
              amount: undefined,
              factoryPrice: undefined,
              length: undefined,
              width: undefined,
              sizeCustomizable: 0,
              name: '',
              url: '',
              remark: '',
            }
          ]
        },
      }
    },
    methods: {
      changeType () {
        if (this.newCommodityAttributes.attributeValueList == null || this.newCommodityAttributes.attributeValueList.length === 0) {
          this.newCommodityAttributes.attributeValueList = [{
            recommend: 0,
            amount: undefined,
            factoryPrice: undefined,
            length: undefined,
            width: undefined,
            sizeCustomizable: 0,
            name: '',
            url: '',
            remark: '',
          }
          ]
        }
      },
      init (obj) {
        this.visible = true;
        this.$nextTick(function () {
          //重置提示信息
          this.$refs['commodityAttrAddForm'].clearValidate()
          if (obj) {
            this.isEdit = true
            this.newCommodityAttributes = {
              id: obj.id,
              category: obj.category,
              name: obj.name,
              type: obj.type,
              selectType: obj.selectType,
              quantity: obj.quantity,
              amount: obj.amount,
              factoryPrice: obj.factoryPrice,
              remark: obj.remark,
              attributeValueList: JSON.parse(JSON.stringify(obj.attributeValueList))
            }
          } else {
            this.isEdit = false
            this.newCommodityAttributes = {
              name: '',
              category: 1,
              type: 2,
              selectType: 0,
              quantity: 1,
              amount: undefined,
              factoryPrice: undefined,
              remark: '',
              attributeValueList: [
                {
                  recommend: 0,
                  amount: undefined,
                  factoryPrice: undefined,
                  length: undefined,
                  width: undefined,
                  sizeCustomizable: 0,
                  name: '',
                  url: '',
                  remark: '',
                }
              ]
            }
          }
        })
      },
      close () {
        this.visible = false
      },
      handleSelectType () {
        this.$refs['commodityAttrAddForm'].clearValidate()
      },
      handleAddAttributes () {
        this.$refs['commodityAttrAddForm'].validate((valid) => {
          if (valid) {
            this.close()
            let obj = {
              id: this.newCommodityAttributes.id,
              name: this.newCommodityAttributes.name,
              category: this.newCommodityAttributes.category,
              type: this.newCommodityAttributes.type,
              selectType: this.newCommodityAttributes.selectType,
              quantity: this.newCommodityAttributes.quantity,
              amount: this.newCommodityAttributes.amount,
              factoryPrice: this.newCommodityAttributes.factoryPrice,
              remark: this.newCommodityAttributes.remark,
              attributeValueList: JSON.parse(JSON.stringify(this.newCommodityAttributes.attributeValueList))
            }
            this.$emit('handleAddAttributes', obj)
          }
        })
      },
    }
  }
</script>

<style scoped>
</style>
