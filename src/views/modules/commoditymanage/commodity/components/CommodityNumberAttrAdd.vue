<template>
  <!--新增或修改-->
  <el-dialog
    :title="$t('common.edit')"
    :close-on-click-modal="false"
    :before-close="close"
    :visible.sync="visible">
    <el-form :model="newCommodityNumberAttributes" ref="commodityNumberAttrAddForm" label-width="120px"
             size="small">
      <el-form-item
        :label="$t('manage.commodity.commodityNumberAttrAdd.name')"
        :rules="{required: true, message: $t('manage.commodity.commodityNumberAttrAdd.nameRule'), trigger: 'blur'}"
        prop="name">
        <el-input v-model="newCommodityNumberAttributes.name"></el-input>
      </el-form-item>

      <template v-for="(item,index) in newCommodityNumberAttributes.numberAttributeValueList">
        <el-form-item
          :label="$t('manage.commodity.commodityNumberAttrAdd.value')+(index+1)+'：'"
          :key="index"
          :rules="{required: true, message: $t('manage.commodity.commodityNumberAttrAdd.valueRule'), trigger: 'blur'}"
          :prop="'numberAttributeValueList.'+index+'.name'">
          <el-input v-model="item.name">
            <el-button v-if="$ArrayUtil.switchAble(newCommodityNumberAttributes.numberAttributeValueList,index,+1)"
                       @click="$ArrayUtil.switchOffset(newCommodityNumberAttributes.numberAttributeValueList,index,+1)"
                       slot="append"
                       icon="el-icon-caret-bottom"></el-button>
            <el-button v-if="$ArrayUtil.switchAble(newCommodityNumberAttributes.numberAttributeValueList,index,-1)"
                       @click="$ArrayUtil.switchOffset(newCommodityNumberAttributes.numberAttributeValueList,index,-1)"
                       slot="append"
                       icon="el-icon-caret-top"></el-button>
            <el-button slot="append" v-if="index!==0" @click="removeAttributes(index)" type="danger"
                       icon="el-icon-delete"></el-button>
            <el-button slot="append" v-if="index===0" @click="addAttributes" type="primary"
                       icon="el-icon-plus"></el-button>
          </el-input>
        </el-form-item>

      </template>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <!--取消--><el-button @click="close()">{{$t('common.cancel')}}</el-button>
      <!--确认--><el-button type="primary" @click="handleAddNumberAttributes()" :disabled="repeatVisible">{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>

  export default {
    name: 'CommodityNumberAttrAdd',
    data () {
      return {
        visible: false,
        repeatVisible: false,
        isEdit: false,
        newCommodityNumberAttributes: {
          name: '',
          numberAttributeValueList: [{name: '', url: '',}]
        },
      }
    },
    methods: {
      init (obj) {
        this.visible = true
        this.$nextTick(function () {
          //重置提示信息
          this.$refs['commodityNumberAttrAddForm'].clearValidate()
          if (obj) {
            this.isEdit = true
            this.newCommodityNumberAttributes = {
              id: obj.id,
              name: obj.name,
              numberAttributeValueList: JSON.parse(JSON.stringify(obj.numberAttributeValueList))
            }
          } else {
            this.isEdit = false
            this.newCommodityNumberAttributes = {
              name: '',
              numberAttributeValueList: [{name: '', url: '',}]
            }
          }
        })
      },
      close () {
        this.visible = false
      },
      handleAddNumberAttributes () {
        this.$refs['commodityNumberAttrAddForm'].validate((valid) => {
          if (valid) {
            let obj = {
              id: this.newCommodityNumberAttributes.id,
              name: this.newCommodityNumberAttributes.name,
              numberAttributeValueList: JSON.parse(JSON.stringify(this.newCommodityNumberAttributes.numberAttributeValueList))
            }
            this.$emit('handleAddAttributes', obj)
            this.close()
          }
        })
      },
      addAttributes () {
        this.newCommodityNumberAttributes.numberAttributeValueList.push({name: '', url: '',})
      },
      removeAttributes (index) {
        this.newCommodityNumberAttributes.numberAttributeValueList.splice(index, 1)
      },
    }
  }
</script>

<style scoped>
</style>
