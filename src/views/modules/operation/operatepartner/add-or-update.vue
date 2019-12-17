<template>
  <el-dialog
    :title="!dataForm.id ? $t('common.add') : $t('common.update')"
    :close-on-click-modal="false"
    @close='closeDialog'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-form-item :label="$t('manage.operation.partner.type')" prop="type" >
        <el-select :disabled="dataForm.id!==0" v-model="dataForm.type" :clearable="true" placeholder="">
          <el-option :label="$t('manage.operation.partner.type1')" :value="1">{{$t('manage.operation.partner.type1')}}</el-option>
          <el-option :label="$t('manage.operation.partner.type2')" :value="2">{{$t('manage.operation.partner.type2')}}</el-option>
          <el-option :label="$t('manage.operation.partner.type3')" :value="3">{{$t('manage.operation.partner.type3')}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('manage.operation.partner.title')" prop="title">
        <el-input v-model="dataForm.title" :placeholder="$t('manage.operation.partner.plaTitle')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('manage.operation.partner.content')" prop="content">
        <editor id="editor_id" width="100%" height="200"
                :content="dataForm.content"
                :cssData="'.ke-content img {max-width: 600px;height:auto;}'"
                pluginsPath="/static/kindeditor/plugins/"
                :loadStyleMode="false"
                :uploadJson="global.uploadKEUrl"
                @on-content-change="onContentChange"
                :items="['source', '|', 'undo', 'redo', '|', 'preview', 'cut', 'copy', 'paste',
                     '|', 'justifyleft', 'justifycenter', 'justifyright',
                    'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                    'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
                    'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                    'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
                    'table', 'hr', 'pagebreak','link', 'unlink', '|']"
        >
        </editor>
      </el-form-item>




    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {partner} from '@/action/operatepartner'

    export default {

        data() {
            let validateName = (rule, value, callback) => {
                if (this.checkSpecificKey(value)) {
                    callback();
                } else {
                    callback(new Error(this.$t('manage.coupon.validate.wrongName')))
                }
            };
            return {
                visible: false,
                dataForm: {
                    id: 0,
                    title: '',
                    content: '',
                    type: '',
                },
                dataRule: {
                    title: [
                        {required: true, message: this.$t('manage.operation.partner.titleRule'), trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: this.$t('manage.operation.partner.contentRule'), trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            onContentChange(val) {
                this.dataForm.content = val
            },
            init(id) {
                this.dataForm.id = id || 0
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.id) {
                        partner.info(this.dataForm.id).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.title = data.operatePartner.title
                                this.dataForm.content = data.operatePartner.content
                                this.dataForm.type = parseInt(data.operatePartner.type)
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            'id': this.dataForm.id || undefined,
                            'title': this.dataForm.title,
                            'content': this.dataForm.content,
                            'type': this.dataForm.type ,
                        }
                        let tick = !this.dataForm.id ? partner.add(params) : partner.update(params)
                        tick.then(({data}) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: this.$t('common.success'),
                                    type: 'success',
                                    duration: 1500,
                                    onClose: () => {
                                        this.visible = false
                                        this.$emit('refreshDataList')
                                    }
                                })
                            } else {
                                this.$message.error(data.msg)
                            }
                        })
                    }
                })
            },
            beforeAvatarUpload(file) {
                return true;
            },
            handleAvatarSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                // console.log(res)
                if (res && res.code === 200) {
                    this.dataForm.logo = res.result.title;
                }
            },
            closeDialog() {
                this.dataForm.logo = ''
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
        }
    }
</script>
