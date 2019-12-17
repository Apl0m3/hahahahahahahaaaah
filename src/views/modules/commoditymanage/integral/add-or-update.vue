<template>
  <!--新增或修改--><el-dialog
    :title="!dataForm.id ? $t('manage.commodity.commodity1.newAdd') :$t('manage.commodity.commodity1.modify')"
    :close-on-click-modal="false"
    :before-close="close"
    :visible.sync="visible">
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @submit.native.prevent label-width="80px">
    <!--商品名称-->
    <el-form-item :label="$t('manage.commodity.commodity1.name')" prop="name">
        <el-input v-model.trim="dataForm.name" :placeholder="$t('manage.commodity.commodity1.name')"></el-input>
    </el-form-item>

    <!--  积分-->
    <el-form-item :label="$t('manage.commodity.commodity1.amount')" prop="amount">
      <el-input v-model.trim="dataForm.amount" :placeholder="$t('manage.commodity.commodity1.amountPlaceHolder')"></el-input>
    </el-form-item>
    <!-- 总数量-->
    <el-form-item :label="$t('manage.commodity.commodity1.addOrUpdate.totalNum')" prop="totalNum">
      <el-input v-model.trim="dataForm.totalNum" :placeholder="$t('manage.commodity.commodity1.addOrUpdate.totalPlaceHolder')"></el-input>
    </el-form-item>
    <!--商品分类--><el-form-item :label="$t('manage.commodity.commodity1.addOrUpdate.typeIds')" prop="commodityTypeId">
        <el-select  v-model="dataForm.commodityTypeId"  :placeholder="$t('manage.commodity.commodity1.addOrUpdate.choice')"  @change="selectOne"  :disabled="dataForm.id!== undefined">
          <el-option
            v-for="item in dataForm.typeIds"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <!--<span style="float: left">{{ item.name }}</span>-->
            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>-->
          </el-option>
        </el-select>
      </el-form-item>
    <!--商品图片--><el-form-item :label="$t('manage.commodity.commodity1.image')" prop="image">
        <el-upload
          class="avatar-uploader"
          :action="global.uploadUrl"
          :show-file-list="false"
          accept="image/jpeg,image/gif,image/png"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :multiple="true"
        >
          <img v-if="dataForm.image" :src="global.showUrl+dataForm.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    <!--轮播图--><el-form-item :label="$t('manage.commodity.commodity1.addOrUpdate.commodityFiles')" prop="commodityFiles">
        <el-upload
          ref="commodityFiles"
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="fileList"
          :multiple="true"
          :limit="6"
          :action="global.uploadUrl"
          :on-success="handleFileSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleFileRemove"
          :on-exceed="limitOut">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    <!--分享描述--><el-form-item :label="$t('manage.commodity.commodity1.addOrUpdate.remark')" prop="remark">
        <!--        <vue-wangeditor id="editor1" v-model="dataForm.remark" ref="editor1" :menus="menus" width="70%" height="200"></vue-wangeditor>-->
        <el-input type="textarea" :rows="2" v-model.trim="dataForm.remark" :placeholder="$t('manage.commodity.commodity1.addOrUpdate.remark')"></el-input>
      </el-form-item>
    <!--商品描述--><el-form-item :label="$t('manage.commodity.commodity1.addOrUpdate.description')" prop="description">
    <editor :id="'editor'+new Date().getTime()"
            :content.sync="dataForm.description"
            :uploadJson="global.uploadKEUrl"
            :cssData="'.ke-content img {max-width: 600px;height:auto;}'"
            :loadStyleMode="false"
            :allowImageRemote="false"
            pluginsPath="/static/kindeditor/plugins/"
            :items="[  'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                     '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent',
                    'quickformat', 'selectall', '|', 'fullscreen',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'hr',  '|']"
    />
    <!--<el-input-->
      <!--:autoSize="true"-->
      <!--v-model="dataForm.description"-->
      <!--type="textarea"-->
      <!--maxlength="1000"-->
      <!--show-word-limit>-->
    <!--</el-input>-->
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <!--取消--><el-button @click="close()">{{$t('manage.commodity.commodity1.cancel')}}</el-button>
      <!--确认--><el-button type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t('manage.commodity.commodity1.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commodity} from '@/action/commodity'
  import {commoditytype} from '@/action/commoditytype'
  // import vueWangeditor from 'vue-wangeditor'

  export default {
    data () {
      const checkName = (rule, value, callback) => {

        if (this.checkSpecificKey(value)) {
          callback();
        } else {
          callback(new Error(this.$t('manage.coupon.validate.wrongName')))
        }
      };
      let validateTotalNum = (rule, value, callback) => {
        if(typeof(this.dataForm.id) == "undefined"){

        }
        let num = /^[1-9]\d*$/;
        if (!num.test(value)) {
          callback(new Error(this.$t('manage.coupon.validate.mustNum')));
        }else{
          callback();
        }
      };
      let validateAmount = (rule, value, callback) => {
        let num = /^[1-9]\d*$/;
        if (!num.test(value)) {
          callback(new Error(this.$t('manage.coupon.validate.mustNum')));
        }else{
          callback();
        }
      };





      var getNumber = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.getNumber')))
        } else {
          const reg = /(^[1-9]\d{0,4}\.\d{1,2}$)|(^[1-9]\d{0,4}$)/
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error(this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.getNumber1')))
          }
        }
      }
      var getMaxAndMin = (rule, value, callback) => {
        if (this.dataForm.showMaxAmount !== '') {
          if (Number(this.dataForm.showMaxAmount) < Number(value)) {
            return callback(new Error(this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.getMaxAndMin')))
          } else {
            callback()
          }
        } else {
          return callback(new Error(this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.getMaxAndMin1')))
        }
      }

      return {
        id: 'editor2',
        repeatVisible: false,
        // menus: [
        //   'source', // 源码模式
        //   '|',
        //   'bold', // 粗体
        //   'underline', // 下划线
        //   'italic', // 斜体
        //   'strikethrough', // 中线
        //   'eraser', // 清空格式
        //   'forecolor', // 文字颜色
        //   '|',
        //   'quote', // 引用
        //   'fontfamily', // 字体
        //   'fontsize', // 字号
        //   'head', // 标题
        //   'unorderlist', // 无序列表
        //   'orderlist', // 有序列表
        //   'alignleft', // 左对齐
        //   'aligncenter', // 居中
        //   'alignright', // 右对齐
        //   '|',
        //   'link', // 链接
        //   'unlink', // 取消链接
        //   'table', // 表格
        //   '|',
        //   'img',
        //   'insertcode', // 插入代码
        //   '|',
        //   'undo', // 撤销
        //   'redo', // 重做
        //   'fullscreen' // 全屏
        // ],
        initContent2: '',
        dialogImageUrl: '', // 轮播图
        dialogVisible: false, // 轮播图
        fileList: [], // 轮播图
        fileUrl: '',
        visible: false,
        attributesList: [],
        options: [],
        dataForm: {
          commodityTypeId: '',
          typeIds: [],
          attributesIds: [],
          commodityFiles: [],
          id: 0,
          name: '',
          type: 2,
          image: '',
          remark: '',
          description: '',
          amount:'',
          num:'',//剩余数量
          totalNum:'',//总数量
        },
        editorText: '',
        dataRule: {
          name: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.name1'), trigger: 'blur'},
            {max: 50, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.name2'), trigger: 'blur'},
            {validator: checkName, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.name1'), trigger: 'blur'}
          ],
          remark: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.remark1'), trigger: 'blur'},
            {max: 1000, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.remark2'), trigger: 'blur'},
          ],
          description: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.description1'), trigger: 'blur'}
          ],
          image: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.image1'), trigger: 'blur'}
          ],
          totalNum: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.totalNumRule'), trigger: 'blur'},
            { validator: validateTotalNum, trigger: 'blur' }
          ],
          commodityTypeId: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.commodityTypeId1'), trigger: 'blur'}
          ],
          commodityFiles: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.commodityFiles1'), trigger: 'blur'}
          ],
          amount: [
            {required: true, message: this.$t('manage.commodity.commodity1.addOrUpdate.dataRule.amountRule'), trigger: 'blur'},
            { validator: validateAmount, trigger: 'blur' }
          ]
          // showMinAmount: [
          //   {required: true, message: '请选择轮播图片', trigger: 'blur'}
          // ],
          // showMaxAmount: [
          //   {required: true, message: '请选择轮播图片', trigger: 'blur'}
          // ]
          // showMinAmount: [
          //   {required: true, message: '当前值不能为空', trigger: 'blur'},
          //   {validator: getNumber, trigger: 'blur'},
          //   {validator: getMaxAndMin, trigger: 'blur'}
          // ],
          // showMaxAmount: [
          //   {required: true, message: '当前值不能为空', trigger: 'blur'},
          //   {validator: getNumber, trigger: 'blur'}
          // ]
        }
      }
    },
    methods: {
      selectOne (id) {
        this.dataForm.commodityTypeId = id
      },
      onContentChange (val) {
        this.dataForm.description = val
      },
      init (id) {
        this.dataForm.id = id
        this.visible = true
        this.repeatVisible = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs['commodityFiles'].clearFiles()
          this.fileList = []

          commoditytype.listAll({}).then(({data}) => {
            if (data && data.code === 200) {
              this.dataForm.typeIds = data.result
            }
          })

          if (this.dataForm.id !== undefined) {
            commodity.integralInfo(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                // this.dataForm.attributesIds = data.commodityAddDto.attributesIds || []
                // this.dataForm.typeIds = data.commodityAddDto.typeIds || []
                var commodityFiles = data.commodityAddDto.commodityFiles || []
                this.dataForm.commodityFiles = commodityFiles
                for (var i in commodityFiles) {
                  var obj = {
                    name: commodityFiles[i].fileUrl,
                    fileUrl: commodityFiles[i].fileUrl,
                    url: this.global.showUrl + commodityFiles[i].fileUrl
                  }
                  this.fileList.push(obj)
                }
                var commodity = data.commodityAddDto.commodity
                this.dataForm.name = commodity.name
                this.dataForm.remark = commodity.remark
                this.dataForm.description = commodity.description
                this.dataForm.image = commodity.image
                this.dataForm.type = commodity.type
                  if(commodity.commodityTypeId !== '' && commodity.commodityTypeId != null){
                      this.dataForm.commodityTypeId = parseInt(commodity.commodityTypeId);
                  }else {
                      this.dataForm.commodityTypeId = '';
                  }

                this.dataForm.amount = commodity.amount
                this.dataForm.totalNum = commodity.totalNum
                // this.dataForm.showMaxAmount = commodity.showAmountMax
                // this.dataForm.showMinAmount = commodity.showAmountMin
                this.initContent2 = commodity.description
              // this.setContent2();
              }
            })
          } else {
            this.dataForm.commodityTypeId = ''

          }
        })
      },
      close () {
        this.visible = false
      // this.$refs.editor2.clear();
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.repeatVisible = true
            var data = {
              id: this.dataForm.id,
              name: this.dataForm.name,
              type: 2,
              commodityTypeId: this.dataForm.commodityTypeId,
              image: this.dataForm.image,
              remark: this.dataForm.remark,
              description: this.dataForm.description,
              amount: this.dataForm.amount,
              totalNum: this.dataForm.totalNum,
            };
            if(typeof(this.dataForm.id) == "undefined"){
              data["num"] = this.dataForm.totalNum
            }
            var param = {
              commodityFiles: this.dataForm.commodityFiles,
              commodity: data
            }
            var tick = !this.dataForm.id ? commodity.addIn(param) : commodity.updateIn(param)
            tick.then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: this.$t('manage.commodity.commodity1.success'),
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  // this.$refs.editor2.clear();
                  }
                })
              } else {
                this.$message.error(data.msg);
                this.repeatVisible = false
              }
            })
          }
        })
      },
      // 单张图片
      handleAvatarSuccess (res, file) {
        if (res && res.code === 200) {
          this.dataForm.image = res.result.title
        }
      },
      // 单张图片
      beforeAvatarUpload (file) {
        return true
      },
      // 多文件
      handleFileRemove (file, fileList) {
        // console.log(file);
        var url = ''
        if (file.response) {
          url = file.response.result.title
        } else {
          url = file.fileUrl
        }

        let files = this.dataForm.commodityFiles
        var index = -1
        for (let i = 0; i < files.length; i++) {
          if (files[i].fileUrl === url) {
            index = i
            break
          }
        }
        this.dataForm.commodityFiles.splice(index, 1)
      },
      limitOut (file, fileList) {
        this.$message.error(this.$t('manage.commodity.commodity1.error1'))
      },
      // 多文件
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 多文件
      handleFileSuccess (res, file) {
        let type = this.checkFileType(res.result.title)
        let commodityFile = {
          fileUrl: res.result.title,
          fileType: type
        }
        if (type === 2) {
          this.dataForm.commodityFiles.unshift(commodityFile)
        } else {
          this.dataForm.commodityFiles.push(commodityFile)
        }
      },
      checkFileType (url) {
        const index = url.indexOf('.')// （考虑严谨用lastIndexOf(".")得到）得到"."在第几位
        url = url.substring(index)// 截断"."之前的，得到后缀
        if (url === '.bmp' || url === '.png' || url === '.gif' || url === '.jpg' || url === '.jpeg') { // 根据后缀，判断是否符合图片格式
          return 1
        } else if (url === '.mp4' || url === '.rmvb' || url === '.avi' || url === '.ts') { // 根据后缀，判断是否符合视频格式
          return 2
        } else {
          this.$message.error(this.$t('manage.commodity.error2'))
        }
      },
      //特殊字符过滤
      checkSpecificKey(str) {
        var specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】@‘；：”“'。，、？\"\"]‘'";
        for (var i = 0; i < str.length; i++) {
          if (specialKey.indexOf(str.substr(i, 1)) != -1) {
            return false;
          }
        }
        return true;
      },
      // getContent2() {
      //   this.initContent2 = this.$refs.editor2.getHtml(this.initContent2);
      // }
      // ,
      // setContent2() {
      //   if (!this.$refs.editor2.editor) return;
      //   this.$refs.editor2.setHtml(this.initContent2)
      // }
    }
    // components: {
    //   vueWangeditor,
    // }
  }
</script>
<style>
  .el-form-item__error {
    top: 104%;
  }

  .avatar-uploader-icon {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
</style>
