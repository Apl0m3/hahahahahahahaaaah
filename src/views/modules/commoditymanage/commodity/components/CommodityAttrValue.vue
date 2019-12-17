<template>
  <div>
    <!--<div class="header">-->
      <!--<el-button type="primary"-->
                 <!--plain-->
                 <!--@click="showAddModal">导入文件-->
      <!--</el-button>-->
    <!--</div>-->
    <!--<el-dialog title="导入文件" :visible.sync="visible">-->
      <!--<a href="javascript:;" class="file">-->

        <!--<input id="upload" ref="input" type="file"  @change="importfxx(this)"-->
               <!--accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>-->
      <!--</a>-->
      <!--<div id="demo"></div>-->

      <!--<div slot="footer" class="dialog-footer">-->

        <!--<el-button @click.native="canle">取消</el-button>-->

        <!--<el-button type="primary" @click="add"   >提交</el-button>-->

      <!--</div>-->

    <!--</el-dialog>-->
    <a href="javascript:;" class="file">

      <input id="upload" ref="input" type="file"  @change="importfxx(this)"
             accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
    </a>
    <div v-for="(item,index) in value" :key="index">
      <el-form-item :label="$t('manage.commodity.commodityAttrValue.value')+(index+1)+'：'">
      </el-form-item>

      <el-form-item
        :label="$t('manage.commodity.commodityAttrValue.recommend')"
        :rules="{required: true, message: $t('manage.commodity.commodityAttrValue.recommendRequired'), trigger: 'blur'}"
        :prop="'attributeValueList.'+index+'.recommend'">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="item.recommend">
        </el-switch>
      </el-form-item>
      <el-form-item
        :label="$t('manage.commodity.commodityAttrValue.amount')"
        :rules="[{required: true, message: $t('manage.commodity.commodityAttrValue.amountRule'), trigger: 'blur'},{validator:checkAmount}]"
        :prop="'attributeValueList.'+index+'.amount'">
        <el-input-number
          :placeholder="$t('manage.commodity.commodityAttrValue.amountPla')"
          :min="0"
          :max="100000000"
          v-model="item.amount"></el-input-number>
      </el-form-item>
      <el-form-item
        :label="$t('manage.commodity.commodityAttrValue.factoryPrice')"
        :rules="[{required: true, message:  $t('manage.commodity.commodityAttrValue.amountRule'), trigger: 'blur'},{validator:checkAmount}]"
        :prop="'attributeValueList.'+index+'.factoryPrice'">
        <el-input-number
          :placeholder="$t('manage.commodity.commodityAttrValue.amountPla')"
          :min="0"
          :max="100000000"
          v-model="item.factoryPrice"></el-input-number>
      </el-form-item>
      <!--长宽-->
      <template v-if="params.category===2">
        <el-row>
          <el-col :span="8">
            <el-form-item
              :label="$t('manage.commodity.commodityAttrValue.length')"
              :rules="[{required: !item.sizeCustomizable, message: $t('manage.commodity.commodityAttrValue.lengthRule'), trigger: 'blur'},{validator:checkAmount}]"
              :prop="'attributeValueList.'+index+'.length'">
              <el-input :placeholder="$t('manage.commodity.commodityAttrValue.lengthPla')" v-model="item.length" :disabled="item.sizeCustomizable===1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('manage.commodity.commodityAttrValue.width')"
              :rules="[{required: !item.sizeCustomizable, message: $t('manage.commodity.commodityAttrValue.widthRule'), trigger: 'blur'},{validator:checkAmount}]"
              :prop="'attributeValueList.'+index+'.width'">
              <el-input :placeholder="$t('manage.commodity.commodityAttrValue.widthPla')" v-model="item.width" :disabled="item.sizeCustomizable===1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('manage.commodity.commodityAttrValue.sizeCustomizable')"
              :rules="{required: true, message: $t('manage.commodity.commodityAttrValue.sizeCustomizableRule'), trigger: 'blur'}"
              :prop="'attributeValueList.'+index+'.sizeCustomizable'">
              <el-switch
                style="display: block"
                :active-value="1"
                :inactive-value="0"
                @change="(val)=>{if(val===1){item.length=item.width=undefined}}"
                v-model="item.sizeCustomizable">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-form-item
        v-if="params.selectType !==1"
        :label="$t('manage.commodity.commodityAttrValue.name')"
        :rules="[{required: true, message: $t('manage.commodity.commodityAttrValue.nameRule1'), trigger: 'blur'},{min:1,max:200, message: $t('manage.commodity.commodityAttrValue.nameRule2'), trigger: 'blur'}]"
        :prop="'attributeValueList.'+index+'.name'">
        <el-input :placeholder="$t('manage.commodity.commodityAttrValue.contentPla')" v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item v-if="params.type === 2 && params.selectType !==0"
                    :label="$t('manage.commodity.commodityAttrValue.url')"
                    :key="'url'+index"
                    :rules="{required: true, message: $t('manage.commodity.commodityAttrValue.urlRule'), trigger: 'blur'}"
                    :prop="'attributeValueList.'+index+'.url'">
        <single-upload v-model="item.url"/>
      </el-form-item>
      <el-form-item
        v-if="params.selectType ===3"
        :label="$t('manage.commodity.commodityAttrValue.remark')"
        :rules="[{required: true, message: $t('manage.commodity.commodityAttrValue.remarkRule1'), trigger: 'blur'},{min:1,max:200, message:  $t('manage.commodity.commodityAttrValue.remarkRule2'), trigger: 'blur'}]"
        :prop="'attributeValueList.'+index+'.remark'">
        <el-input :placeholder="$t('manage.commodity.commodityAttrValue.contentPla')" v-model="item.remark"></el-input>
      </el-form-item>
      <el-form-item v-if="params.type !== 1">
        <el-button v-if="$ArrayUtil.switchAble(value,index,+1)" @click="$ArrayUtil.switchOffset(value,index,+1)"
                   size="small" icon="el-icon-caret-bottom" circle
                   style="float:right"></el-button>
        <el-button v-if="$ArrayUtil.switchAble(value,index,-1)" @click="$ArrayUtil.switchOffset(value,index,-1)"
                   size="small" icon="el-icon-caret-top" circle
                   style="float:right"></el-button>
        <el-button size="medium" @click="addAttributes" type="primary" icon="el-icon-plus">{{$t('manage.commodity.commodityAttrValue.more')}}</el-button>
        <el-button size="medium" v-if="index!==0" @click="removeAttributes(index)" type="danger"
                   icon="el-icon-delete">{{$t('common.delete')}}
        </el-button>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'

  export default {
    name: 'CommodityAttrValue',
    components: {SingleUpload, MultiUpload},
    props: {
      value: Array,
      params: {
        type: Object
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
              obj.name = v.name
              if (v.recommend && v.recommend !== undefined) {
                obj.recommend = v.recommend
              } else {
                obj.recommend = 0
              }
              obj.amount = v.amount
              obj.factoryPrice = v.factoryPrice
              obj.url = ''
              obj.remark = ''
              obj.sizeCustomizable = 0
              obj.length = undefined
              obj.width = undefined
              arr.push(obj)
            })
            let list = []
            if (arr && arr.length > 0) {
              list = arr
              console.log('1998', list)
              console.log('1997', arr)
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
        if (f) {
          if (rABS) {
            reader.readAsArrayBuffer(f)
          } else {
            reader.readAsBinaryString(f)
          }
        } else {
  
        }
      },
      add (list) {
        if (this.value && this.value.length > 0) {
          for (let aa = 0; aa < this.value.length; aa++) {
            this.value.splice(aa, 1)
          }
        }
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            this.value.push(
              {
                recommend: list[i].recommend,
                amount: list[i].amount,
                factoryPrice: list[i].factoryPrice,
                name: list[i].name,
                url: '',
                remark: '',
                sizeCustomizable: 0,
                length: undefined,
                width: undefined
              }
            )
          }
          this.$refs.input.value = ''
          // this.value = this.arr
        }
      },
      // canle () {
      //   this.visible = false
      //   this.$refs.input.value = ''
      // },
      // showAddModal () {
      //   this.visible = true
      // },
      addAttributes () {
        this.value.push(
          {
            recommend: 0,
            amount: undefined,
            factoryPrice: undefined,
            name: '',
            url: '',
            remark: '',
            sizeCustomizable: 0,
            length: undefined,
            width: undefined
          }
        )
      },
      removeAttributes (index) {
        this.value.splice(index, 1)
      },

      checkAmount (rule, value, callback) {
        // 不判断空,如果为空，直接返回
        if (!value) {
          return callback()
        }
        const reg = /^\d+\.?\d{0,4}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error(this.$t('manage.commodity.commodityAttrValue.error')))
        }
      },
      checkFactoryPrice (rule, value, callback) {
        // 不判断空,如果为空，直接返回
        if (!value) {
          return callback()
        }
        const reg = /^\d+\.?\d{0,4}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error(this.$t('manage.commodity.commodityAttrValue.error')))
        }
      }
    }
  }
</script>

<style scoped>
</style>
