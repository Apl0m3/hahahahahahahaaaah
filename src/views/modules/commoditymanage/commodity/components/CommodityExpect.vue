<template>
  <div style="margin-top: 50px">
    <a href="javascript:;" class="file">

      <input id="upload" ref="input" type="file"  @change="importfxx(this)"
             accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </a>
    <el-form :model="value"
             ref="commodityExpectForm"
             label-width="120px"
             style="width: 680px"
             size="small">
      <div v-for="(item,index) in value.commodityExpectedArray" :key="index">
        <el-row class="row-bg" :gutter="8">
          <el-col :span="20">
            <el-form-item :label="$t('manage.commodity.commodityExpect.day')"
                          :rules="[
                          {required:true,message:$t('manage.commodity.commodityExpect.dayRule'),trigger:'blur'},
                          {validator: checkInt,trigger:'blur'}]" :prop="'commodityExpectedArray.'+index+'.day'">
              <el-input v-model.trim="item.day" :placeholder="$t('manage.commodity.commodityExpect.dayPla')" type="number">
                <template slot="prepend">{{$t('manage.commodity.commodityExpect.prepend')}}</template>
                <template slot="append">{{$t('manage.commodity.commodityExpect.append')}}</template>
              </el-input>

            </el-form-item>
          </el-col>
          <el-col :gutter="14">
            <el-form-item :label="$t('manage.commodity.commodityExpect.maxNum')"
                          :rules="[{required:true,message:$t('manage.commodity.commodityExpect.dayRule'),trigger:'blur'},
                      {validator: checkInt,trigger:'blur'}]" :prop="'commodityExpectedArray.'+index+'.maxNum'">
              <el-input v-model.trim="item.maxNum" :placeholder="$t('manage.commodity.commodityExpect.maxNumPla')" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="$t('manage.commodity.commodityExpect.amount')"
                          :rules="[{required:true,message:$t('manage.commodity.commodityExpect.amountRule'),trigger:'blur'},
                          {validator: checkDouble,trigger:'blur'}]"
                          :prop="'commodityExpectedArray.'+index+'.amount'">
              <el-input v-model.trim="item.amount" :placeholder="$t('manage.commodity.commodityExpect.amountPla')" type="number">
                <template slot="append">%</template>
                <!--<template slot="prepend">€</template>-->
              </el-input>

            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item :label="$t('manage.commodity.commodityExpect.factoryPrice')"
                          :rules="[{required:true,message:$t('manage.commodity.commodityExpect.amountRule'),trigger:'blur'},
                          {validator: checkDouble,trigger:'blur'}]"
                          :prop="'commodityExpectedArray.'+index+'.factoryPrice'">
              <el-input v-model.trim="item.factoryPrice" :placeholder="$t('manage.commodity.commodityExpect.amountPla')" type="number">
                <template slot="append">%</template>
                <!--<template slot="prepend">€</template>-->
              </el-input>

            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button icon="el-icon-delete" @click="deleteItem(index)"></el-button>
          </el-col>
        </el-row>
      </div>
      <!--      <el-form-item>
              <el-button type="default" @click="addItem()">添加<i class="el-icon-arrow-right el-icon-plus"></i></el-button>
            </el-form-item>-->
      <el-form-item style="text-align: right">
        <el-button type="default" size="medium" @click="addItem()">{{$t('manage.commodity.commodityExpect.add')}}<i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">{{$t('manage.commodity.commodityExpect.handlePrev')}}</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">{{$t('manage.commodity.commodityExpect.handleFinishCommit')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import {fetchListAll as fetchSubjectList} from '@/api/subject'
  // import {fetchList as fetchPrefrenceAreaList} from '@/api/prefrenceArea'

  export default {
    name: 'CommodityRelationDetail',
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      const checkDouble = (rule, value, callback) => {
        let double = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

        if (!double.test(value)) {
          return callback(new Error(this.$t('manage.commodity.commodityExpect.error1')))
        } else
        if (Number(value) > 999999999.99) {
          return callback(new Error(this.$t('manage.commodity.commodityExpect.error2')))
        }

        callback()
      }
      const checkInt = (rule, value, callback) => {
        let double = /^([1-9][0-9]*)$/

        if (!double.test(value)) {
          return callback(new Error(this.$t('manage.commodity.commodityExpect.error3')))
        } else
        if (Number(value) > 999999999.99) {
          return callback(new Error(this.$t('manage.commodity.commodityExpect.error2')))
        }
        callback()
      }
      return {
        checkDouble: checkDouble,
        checkInt: checkInt,
      }
    },

    methods: {
      addItem () {
        this.value.commodityExpectedArray.push({
          id: null,
          day: null,
          maxNum: null,
          amount: 0,
          factoryPrice: 0,
          commodityId: this.value.commodity.id
        })
      },
      deleteItem (i) {
        this.value.commodityExpectedArray.splice(i, 1)
      },
      handlePrev () {
        this.$emit('prevStep')
      },
      handleFinishCommit () {

        this.$refs['commodityExpectForm'].validate((valid) => {
          if (valid) {
            if (this.value.commodityExpectedArray && this.value.commodityExpectedArray.length > 0) {
              this.$emit('finishCommit', this.isEdit)
            } else {
              this.$message.warning(this.$t('manage.commodity.commodityExpect.warn'))
            }
          }
        })
      },
      importfxx (obj) {
        let _this = this
        // let inputDOM = this.$refs.inputer
        // 通过DOM取文件数据
        this.file = event.currentTarget.files[0]
        console.log(this.file)
        var rABS = false // 是否将文件读取为二进制字符串
        var f = this.file
        var reader = new FileReader()
        // if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function (f) {
          console.log('123', f)
          var binary = ''
          var rABS = false // 是否将文件读取为二进制字符串
          var pt = this
          var wb // 读取完成的数据
          var outdata
          var reader = new FileReader()
          reader.onload = function (e) {
            console.log('456', e)
            var bytes = new Uint8Array(reader.result)
            var length = bytes.byteLength
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            var XLSX = require('xlsx')
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), { // 手动转化
                type: 'base64'
              })
            } else {
              wb = XLSX.read(binary, {
                type: 'binary'
              })
            }
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])// outdata就是你想要的东西
            this.da = [...outdata]
            let arr = []
            console.log(outdata)
            this.da.map(v => {
              let obj = {}
              obj.day = v.day
              if (v.amount && v.amount !== undefined) {
                obj.amount = v.amount
              } else {
                obj.amount = 0
              }
              if (v.factoryPrice && v.factoryPrice !== undefined) {
                obj.factoryPrice = v.factoryPrice
              } else {
                obj.factoryPrice = 0
              }
              obj.maxNum = v.maxNum
              arr.push(obj)
            })
            let list = []
            if (arr && arr.length > 0) {
              list = arr
              console.log('1997', _this.arr)
            }
            _this.add(list)
            console.log('789', arr)
            let para = {
              // withList: JSON.stringify(this.da)
              withList: arr
            }
            _this.$message({
              message: '请耐心等待导入成功',
              type: 'success'
            })
          }
          reader.readAsArrayBuffer(f)
        }
        if (rABS) {
          reader.readAsArrayBuffer(f)
        } else {
          reader.readAsBinaryString(f)
        }
      },
      add (list) {
        // this.value.commodityLadderArray.splice(i, 1)
        if (this.value.commodityExpectedArray && this.value.commodityExpectedArray.length > 0) {
          for (let aa = 0; aa < this.value.commodityExpectedArray.length; aa++) {
            this.value.commodityExpectedArray.splice(aa, 1)
            aa--
          }
        }
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            this.value.commodityExpectedArray.push(
              {
                factoryPrice: list[i].factoryPrice,
                amount: list[i].amount,
                maxNum: list[i].maxNum,
                day: list[i].day,
                id: null,
                commodityId: this.value.commodity.id
              }
            )
          }
          this.$refs.input.value = ''
          // this.value = this.arr
        }
        console.log('thisasdasda', this.value.commodityLadderArray)
      }
    }
  }
</script>

<style scoped>
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
