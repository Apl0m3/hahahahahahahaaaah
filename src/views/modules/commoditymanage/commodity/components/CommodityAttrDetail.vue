<template>
  <div style="margin-top: 50px">
    <el-form ref="productAttrForm" label-width="120px"
             size="small">
      <el-form-item style="text-align: right">
        <el-button size="medium" @click="openAddAttributes()" icon="el-icon-plus" type="primary">{{$t('manage.commodity.commodityAttrDetail.addAttributes')}}</el-button>
      </el-form-item>

      <template v-for="(item,index) in this.value.commodityAttributesArray">
        <el-row style="margin-bottom: 10px;">
          <el-button @click="deleteAttributes(index)" type="danger" size="small" icon="el-icon-delete" circle
                     style="float:right"></el-button>
          <el-button @click="openAddAttributes(index)" type="info" size="small" icon="el-icon-edit" circle
                     style="float:right"></el-button>
          <el-button v-if="$ArrayUtil.switchAble(value.commodityAttributesArray,index,+1)"
                     @click="$ArrayUtil.switchOffset(value.commodityAttributesArray,index,+1)" size="small"
                     icon="el-icon-caret-bottom" circle
                     style="float:right"></el-button>
          <el-button v-if="$ArrayUtil.switchAble(value.commodityAttributesArray,index,-1)"
                     @click="$ArrayUtil.switchOffset(value.commodityAttributesArray,index,-1)" size="small"
                     icon="el-icon-caret-top" circle
                     style="float:right"></el-button>
        </el-row>
        <!--目前只有2-->
        <el-form-item :label="item.name + ' :'">
          <el-row :gutter="20" style="background-color: #f2f6fc;padding: 10px 0;display: flex;justify-content: flex-start;flex-flow: wrap">
            <el-col v-if="item.type===2" :span="3" v-for="(subItem,subIndex) in item.attributeValueList" :key="subIndex"
                    style="margin: 0 30px">
              <el-card :body-style="{ padding: '10px' }">
                <div v-if="item.selectType !==1" style="text-align: center;">
                  <span v-html="subItem.name"></span>
                </div>
                <div v-if="item.selectType !==0">
                  <img class="image" :src="global.showUrl+subItem.url"/>
                </div>
                <div v-if="item.selectType ===2">
                  <span>{{subItem.remark}}</span>
                </div>
              </el-card>
            </el-col>

            <el-col v-if="item.type===3" :span="8">
              <el-select v-model="cacheObj.type">
                <el-option
                  v-for="(subItem,subIndex) in item.attributeValueList"
                  :key="subIndex"
                  :label="subItem.name"
                  :value="subItem.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col v-if="item.type===1" :span="3">
              <el-input></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row v-if="item.category===2">
          <el-col :span="8">
            <el-form-item :label="$t('manage.commodity.commodityAttrDetail.length')">
              <el-input></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('manage.commodity.commodityAttrDetail.width')">
              <el-input></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">{{$t('manage.commodity.commodityAttrDetail.handlePrev')}}</el-button>
        <el-button type="primary" size="medium" @click="handleNext">{{$t('manage.commodity.commodityAttrDetail.handleNext')}}</el-button>
      </el-form-item>
    </el-form>

    <commodity-attr-add ref="commodityAttrAdd" @handleAddAttributes="handleAddAttributes"/>
  </div>
</template>

<script>
  import CommodityAttrValue from './CommodityAttrValue'
  import CommodityAttrAdd from './CommodityAttrAdd'

  export default {
    name: 'CommodityAttrDetail',
    components: {CommodityAttrValue, CommodityAttrAdd},
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        //编辑模式时是否初始化成功
        hasEditCreated: false,
        editIndex: undefined,
        cacheObj: {},
      }
    },
    watch: {
      productId: function (newValue) {
        if (!this.isEdit) return
        if (this.hasEditCreated) return
        if (newValue === undefined || newValue == null || newValue === 0) return
        this.handleEditCreated()
      }
    },
    methods: {
      openAddAttributes (index) {
        this.$nextTick(function () {
          if (index !== undefined) {
            this.editIndex = index
            let obj = this.value.commodityAttributesArray[index]
            this.$refs['commodityAttrAdd'].init(obj)
          } else {
            this.editIndex = undefined
            this.$refs['commodityAttrAdd'].init()
          }
        })
      },
      handlePrev () {
        this.$emit('prevStep')
      },
      handleNext () {
        if (this.value.commodityAttributesArray && this.value.commodityAttributesArray.length <= 0) {
          this.$message.warning(this.$t('manage.commodity.commodityAttrDetail.warn1'))
        } else {
          this.$emit('nextStep')
        }
      },
      handleAddAttributes (obj) {
        if (this.editIndex !== undefined) {
          //修改
          this.value.commodityAttributesArray.splice(this.editIndex, 1, obj)
        } else {
          //新增
          this.value.commodityAttributesArray.push(obj)
        }
      },
      deleteAttributes (index) {
        this.$confirm(this.$t('manage.commodity.commodityAttrDetail.warn2'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.comfirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.value.commodityAttributesArray.splice(index, 1)
        }).catch(() => {
        })
      },
      // moveAttributes (arr,index, offset) {
      //   let targetIndex = index + offset
      //   if (targetIndex < 0 || targetIndex > (arr.length - 1)){
      //     return
      //   }
      //   let cur = arr[index]
      //   let tmp = arr[targetIndex]
      //   //修改
      //   arr.splice(index,1, tmp);
      //   arr.splice(targetIndex,1, cur);
      // },
      // arrowVisible (arr,index, offset) {
      //   let targetIndex = index + offset
      //   return !(targetIndex < 0 || targetIndex > (arr.length - 1));
      // },
    }
  }
</script>

<style scoped>
  .image {
    width: 100%;
    display: block;
  }
  >>>.el-form-item__content{margin-left: 125px!important;}
</style>
