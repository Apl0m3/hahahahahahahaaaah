<template>
  <el-dialog
    width="80%"
    :title="$t('manage.trRecord.reviewManuscript')"
    :close-on-click-modal="false"
    :visible.sync="visible" append-to-body>

    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item :label="$t('manage.trRecord.deliverOrder.manuscript')" prop="status">
        <el-button @click="downloadManuscript()">{{$t('manage.trRecord.deliverOrder.downloadManuscript')}}</el-button>
      </el-form-item>
      <el-form-item :label="$t('manage.trRecord.deliverOrder.status')" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">{{$t('manage.trRecord.deliverOrder.status1')}}</el-radio>
          <el-radio :label="2">{{$t('manage.trRecord.deliverOrder.status2')}}</el-radio>
        </el-radio-group>
        <!--        <el-radio v-model="dataForm.status" label="1">审核成功</el-radio>-->
        <!--        <el-radio v-model="dataForm.status" label="2">审核失败</el-radio>-->
      </el-form-item>
      <el-form-item :label="$t('manage.trRecord.deliverOrder.reason')" v-if="dataForm.status==2">
        <el-input type="textarea"
                  :rows="4" v-model="dataForm.reason"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="dataFormSubmit()">{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>


</template>

<script>
  import {usertransactionrecord} from "../../../../action/usertransactionrecord";

  export default {
    name: "reviewManuscript",
    data() {
      return {
        activeName: 0,
        visible: false,
        transactionCommodityId: 0,
        dataForm: {
          manuscriptUrl: '',
          status: 1,
          reason: ''
        }
      }
    },
    methods: {
      downloadManuscript() {
        window.location.href = this.global.showUrl + this.dataInfo.manuscriptUrl;
      },
      init(id) {
        this.transactionCommodityId = id;
        this.visible = true;
        this.$nextTick(() => {
          // this.$refs['dataForm'].resetFields()
          this.manuscriptInfo();
        })
      },
      manuscriptInfo() {
        usertransactionrecord.queryManuscriptInfo({transactionCommodityId: this.transactionCommodityId}).then(({data}) => {
          if (data && data.code === 200) {
            this.dataInfo = data.info;
          }
        })
      },
      dataFormSubmit() {
        let params = {
          'transactionCommodityId': this.transactionCommodityId,
          'status': this.dataForm.status,
          'reason': this.dataForm.reason,
        };
        usertransactionrecord.reviewManuscript(params).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: this.$t('common.success'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.$emit('refreshDataList');
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
