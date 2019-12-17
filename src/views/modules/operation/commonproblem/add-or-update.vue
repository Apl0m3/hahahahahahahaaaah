<template>
  <el-dialog
    :title="!dataForm.id ? $t('common.add') : $t('common.update')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
      <el-form-item :label="$t('manage.operation.commonProblem.title')" prop="title">
        <el-input type="text"
                  maxlength="30"
                  v-model="dataForm.title" :placeholder="$t('manage.operation.commonProblem.title')" ></el-input>
      </el-form-item>
<!--      <el-form-item label="常见问题描述" prop="content">-->
<!--        <el-input type="textarea"-->
<!--                  :autosize="{ minRows: 2, maxRows: 5}"-->
<!--                  v-model="dataForm.content"-->
<!--                  placeholder="常见问题描述"-->
<!--                  maxlength="500"-->
<!--                  show-word-limit-->
<!--        ></el-input>-->
<!--      </el-form-item>-->
      <!--内容--><el-form-item :label="$t('manage.operation.commonProblem.content')"   prop="content">
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
      <!--        <el-input v-model="dataForm.content" placeholder=""></el-input>-->
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="repeatVisible">{{$t("common.comfirm")}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {commonproblem} from '@/action/operatecommonproblem.js'
  export default {
    data () {
      return {
        visible: false,
        repeatVisible: false,
        dataForm: {
          id: 0,
          title: '',
          content: '',

        },
        dataRule: {
          title: [
            { required: true, message: this.$t('manage.operation.commonProblem.titleRule'), trigger: 'blur' }
          ],
          content: [
            { required: true, message: this.$t('manage.operation.commonProblem.contentRule'), trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      onContentChange (val) {
        this.dataForm.content = val
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.repeatVisible = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            commonproblem.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.title = data.commonProblem.title
                this.dataForm.content = data.commonProblem.content
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.repeatVisible = true;
            let params = {
              'id': this.dataForm.id || undefined,
              'title': this.dataForm.title,
              'content': this.dataForm.content,
            }
            let tick = !this.dataForm.id ? commonproblem.add(params) : commonproblem.update(params)
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
                  this.repeatVisible = false
              }
            })
          }
        })
      }
    }
  }
</script>
