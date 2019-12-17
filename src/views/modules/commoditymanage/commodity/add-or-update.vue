<template> 
  <commodity-detail v-model="commodityId"></commodity-detail>
</template>
<script>
  import CommodityDetail from './components/CommodityDetail'

  export default {
    name: 'addCommodity',
    components: {CommodityDetail},
    data () {
      return {
        commodityId: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (to.query.commodityId) {
          vm.commodityId = to.query.commodityId
        } else {
          vm.commodityId = ''
        }
      })
    }
  }
</script>
<style>
</style>
