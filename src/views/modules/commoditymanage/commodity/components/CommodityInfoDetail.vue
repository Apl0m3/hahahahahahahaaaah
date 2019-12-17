<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="commodityInfoForm" label-width="120px" style="width: 600px"
             size="small">
      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.commodityTypeId')" prop="commodity.commodityTypeId">
        <el-select
          v-model="value.commodity.commodityTypeId"
          :options="commodityTypeList">
          <el-option
            v-for="item in commodityTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.name')" prop="commodity.name">
        <el-input v-model.trim="value.commodity.name"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('manage.commodity.commodityInfoDetail.recommend')"
        prop="commodity.recommend">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="value.commodity.recommend">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.image')" prop="commodity.image">
        <single-upload v-model="value.commodity.image"/>
      </el-form-item>

      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.manuscriptUrl')" prop="commodity.manuscriptUrl">
        <zip-upload v-model="value.commodity.manuscriptUrl"/>
      </el-form-item>

      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.commodityFiles')" prop="commodityFiles">
        <commodity-file-upload v-model="value.commodityFiles"/>
      </el-form-item>

      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.description')" prop="commodity.description">
        <editor :id="'editor'+new Date().getTime()"
                :content.sync="value.commodity.description"
                :uploadJson="global.uploadKEUrl"
                :cssData="'.ke-content img {max-width: 600px;height:auto;}'"
                :loadStyleMode="false"
                :allowImageRemote="false"
                pluginsPath="/static/kindeditor/plugins/"
                :items="[  'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                     '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent',
                    'quickformat', 'selectall', '|', 'fullscreen','image',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'hr',  '|']"
        />
      </el-form-item>

      <el-form-item :label="$t('manage.commodity.commodityInfoDetail.remark')" prop="commodity.remark">
        <editor :id="'editor1'+new Date().getTime()"
                :content.sync="value.commodity.remark"
                :uploadJson="global.uploadKEUrl"
                :cssData="'.ke-content img {max-width: 600px;height:auto;}'"
                :loadStyleMode="false"
                :allowImageRemote="false"
                pluginsPath="/static/kindeditor/plugins/"
                :items="[  'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                     '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent',
                    'quickformat', 'selectall', '|', 'fullscreen','image',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'hr',  '|']"
        />


        <!--<el-input-->
          <!--:autoSize="true"-->
          <!--v-model="value.commodity.remark"-->
          <!--type="textarea"-->
          <!--maxlength="1000"-->
          <!--show-word-limit-->
          <!--:placeholder="$t('manage.commodity.commodityInfoDetail.remarkPla')">-->

        <!--</el-input>-->
      </el-form-item>

      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('commodityInfoForm')">{{$t('manage.commodity.commodityInfoDetail.next')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {commoditytype} from '@/action/commoditytype'
    import SingleUpload from '@/components/Upload/singleUpload'
    import ZipUpload from '@/components/Upload/zipUpload'
    import CommodityFileUpload from '@/components/Upload/commodityFileUpload.vue'

    export default {
        name: 'CommodityInfoDetail',
        components: {CommodityFileUpload, SingleUpload,ZipUpload},
        props: {
            value: Object,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                hasEditCreated: false,
                commodityTypeList: [],
                brandOptions: [],
                image: '',
                manuscript: '',
                rules: {
                    'commodity.commodityTypeId': [{required: true, message: this.$t('manage.commodity.commodityInfoDetail.commodityTypeIdRule'), trigger: 'blur'}],
                    'commodity.recommend': [{required: true, message: this.$t('manage.commodity.commodityInfoDetail.recommendRule'), trigger: 'blur'}],
                    'commodity.name': [
                        {required: true, message: this.$t('manage.commodity.commodityInfoDetail.nameRule1'), trigger: 'blur'},
                        {min: 1, max: 200, message: this.$t('manage.commodity.commodityInfoDetail.nameRule2'), trigger: 'blur'}
                    ],
                    'commodity.image': [{required: true, message: this.$t('manage.commodity.commodityInfoDetail.imageRule'), trigger: 'blur'}],
                    'commodity.manuscriptUrl': [{required: true, message: this.$t('manage.commodity.commodityInfoDetail.manuscriptUrlRule'), trigger: 'blur'}],
                    'fileUrls': [{required: true, message: this.$t('manage.commodity.commodityInfoDetail.fileUrlsRule'), trigger: 'blur'}],
                    'commodity.description': [{required: true, message: this.$t('manage.commodity.commodityInfoDetail.descriptionRule'), trigger: 'blur'}],
                    'commodity.remark': [
                      {required: true, message: this.$t('manage.commodity.commodityInfoDetail.remarkRule1'), trigger: 'blur'}
                      ]
                }
            }
        },
      // {min: 1, max: 1600, message: this.$t('manage.commodity.commodityInfoDetail.remarkRule2'), trigger: 'blur'}
        created() {
            if (this.value.commodity.id) {
            } else {
            }
            this.getProductCateList()
            this.getCommodityTypeList()
        },
        methods: {
            //处理编辑逻辑
            handleEditCreated() {
                if (this.value.productCategoryId != null) {
                }
                this.hasEditCreated = true
            },
            getProductCateList() {
            },
            getCommodityTypeList() {
                commoditytype.listAll().then(({data}) => {
                    if (data.code === 200) {
                        this.commodityTypeList = data.result
                    }
                })
            },
            handleNext(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('nextStep')
                    }
                })
            },
        }
    }
</script>

<style>
 >>>.ke-content img{width: 600px;height: 400px;}
</style>
