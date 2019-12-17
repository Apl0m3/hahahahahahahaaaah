<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step :title="$t('manage.commodity.commodityDetail.step1')"></el-step>
      <el-step :title="$t('manage.commodity.commodityDetail.step2')"></el-step>
      <el-step :title="$t('manage.commodity.commodityDetail.step3')"></el-step>
      <el-step :title="$t('manage.commodity.commodityDetail.step4')"></el-step>
      <el-step :title="$t('manage.commodity.commodityDetail.step5')"></el-step>
    </el-steps>
    <commodity-info-detail
      v-show="this.active===0"
      v-model="commodityParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </commodity-info-detail>
    <commodity-attr-detail
      v-show="this.active===1"
      v-model="commodityParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </commodity-attr-detail>
    <commodity-number-detail
      v-show="this.active===2"
      v-model="commodityParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </commodity-number-detail>
    <commodity-ladder
      v-show="this.active===3"
      v-model="commodityParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </commodity-ladder>
    <commodity-expect
      v-show="this.active===4"
      v-model="commodityParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </commodity-expect>
  </el-card>
</template>
<script>
  import CommodityInfoDetail from './CommodityInfoDetail'
  import CommodityLadder from './CommodityLadder'
  import CommodityNumberDetail from './CommodityNumberDetail'
  import CommodityAttrDetail from './CommodityAttrDetail'
  import CommodityExpect from './CommodityExpect'
  import {commodity} from '@/action/commodity'

  export default {
    name: 'commodityDetail',
    components: {CommodityInfoDetail, CommodityAttrDetail, CommodityNumberDetail, CommodityLadder, CommodityExpect},
    data () {
      return {
        active: 0,
        commodityParam: {
          commodity: {
            numberSelectType:2,
          },
          commodityNumberAttributesArray: [],
          commodityAttributesArray: [],
          commodityFiles: [],
          commodityLadderArray: [],
          commodityExpectedArray: [],
        },
      }
    },
    props: {
      value: String,
      isEdit: {
        type: Boolean,
        default: false
      },
    },
    watch: {
      value (newValue) {
        if (newValue) {
          this.getCommodity()
        }
      }
    },
    methods: {
      prevStep () {
        this.active--
      },
      nextStep () {
        this.active++
      },
      getCommodity () {
        commodity.info(Number(this.value)).then(({data}) => {
          if (data.code === 200) {
            this.commodityParam = data.commodityAddDto
          }
        })
      },
      finishCommit (isEdit) {
        this.$confirm(this.$t('manage.commodity.commodityDetail.warn1'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.comfirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          if (this.value) {
            commodity.update(this.commodityParam).then(({data}) => {
              if (data.code === 200) {
                this.$message.success(this.$t('manage.commodity.commodityDetail.warn2'))
                this.$router.push('/commoditymanage-commodity/index')
              }else{
                this.$message.error(data.msg)
              }
            })
          } else {
            commodity.add(this.commodityParam).then(({data}) => {
              if (data.code === 200) {
                this.$message.success(this.$t('manage.commodity.commodityDetail.warn2'))
                this.$router.push('/commoditymanage-commodity/index')
              }else{
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  .form-container {
    min-width: 800px;
  }
</style>
