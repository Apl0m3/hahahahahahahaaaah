<template>
  <div style="margin-top: 50px">
    <a href="javascript:;" class="file">

      <input id="upload" ref="input" type="file"  @change="importfxx(this)"
             accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </a>
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 80%" size="small">
      <template v-for="(item,index) in value.commodityLadderArray">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('manage.commodity.commodityLadder.num')"
                          :rules="{required:true,message: $t('manage.commodity.commodityLadder.numRule'),trigger:'blur'}" :prop="'commodityLadderArray.'+index+'.num'">
              <el-input-number
                v-model="item.num"
                :min="1"
                :max="10000000000"
                :placeholder="$t('manage.commodity.commodityLadder.numPla')"
                type="number"></el-input-number>

            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('manage.commodity.commodityLadder.discount')"
                          :rules="[{required:true,message:$t('manage.commodity.commodityLadder.discountRule'),trigger:'blur'},{validator: checkDouble}]"
                          :prop="'commodityLadderArray.'+index+'.discount'">
              <el-input v-model.trim="item.discount" :placeholder="$t('manage.commodity.commodityLadder.discountPla')">
                <template slot="append">%</template>
              </el-input>

            </el-form-item>
          </el-col >
          <el-col  :span="4">
            <el-button icon="el-icon-delete" @click="deleteItem(index)"></el-button>
          </el-col>
        </el-row>
      </template>
      <el-form-item style="text-align: right">
        <el-button type="default" size="medium" @click="addItem()">{{$t('manage.commodity.commodityLadder.addItem')}}<i class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">{{$t('manage.commodity.commodityLadder.handlePrev')}}</el-button>
        <el-button type="primary" size="medium" @click="handleNext">{{$t('manage.commodity.commodityLadder.handleNext')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import {fetchList as fetchMemberLevelList} from '@/api/memberLevel'

  export default {
    name: 'CommoditySaleDetail',
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      const checkDouble = (rule, value, callback) => {
        let double = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/

        if (!double.test(value)) {
          return callback(new Error(this.$t('manage.commodity.commodityLadder.error1')))
        } else {
          if (Number(value) > 0 && Number(value) <= 100) {
            callback()
          } else {
            return callback(new Error(this.$t('manage.commodity.commodityLadder.error2')))
          }
        }
      }
      const checkInt = (rule, value, callback) => {
        let double = /^([1-9][0-9]*)$/

        if (!double.test(value)) {
          return callback(new Error(this.$t('manage.commodity.commodityLadder.error1')))
        } else {
          callback()
        }
      }
      return {
        checkDouble: checkDouble,
        checkInt: checkInt,
        // 日期选择器配置
        pickerOptions1: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        }
      }
    },
    methods: {
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
              obj.num = v.num
              if (v.discount && v.discount !== undefined) {
                obj.discount = v.discount
              } else {
                obj.discount = 0
              }
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
        if (this.value.commodityLadderArray && this.value.commodityLadderArray.length > 0) {
          this.value.commodityLadderArray = []
          for (let aa = 0; aa < this.value.commodityLadderArray.length; aa++) {
            this.value.commodityLadderArray.splice(aa, 1)
          }
        }
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            this.value.commodityLadderArray.push(
              {
                num: list[i].num,
                discount: list[i].discount,
                id: null,
                commodityId: this.value.commodity.id
              }
            )
          }
          this.$refs.input.value = ''
          // this.value = this.arr
        }
        console.log('thisasdasda', this.value.commodityLadderArray)
      },
      addItem () {
        this.value.commodityLadderArray.push({
          id: null,
          num: null,
          discount: null,
          commodityId: this.value.commodity.id
        })
      },
      deleteItem (i) {
        this.value.commodityLadderArray.splice(i, 1)
      },
      handlePrev () {
        this.$emit('prevStep')
      },
      handleNext () {
        this.$refs['productSaleForm'].validate((valid) => {
          if (valid) {
            if (this.value.commodityLadderArray && this.value.commodityLadderArray.length <= 0) {
              this.$message.warning(this.$t('manage.commodity.commodityLadder.warning'))
            } else {
              this.$emit('nextStep')
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
