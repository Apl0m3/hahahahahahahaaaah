<template>
  <el-dialog
    :title="$t('manage.commodity.commodityComment.title')"
    :close-on-click-modal="false"
    @close="close"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="$t('manage.commodity.commodityComment.transactionId')" prop="transactionId">
        {{dataForm.transactionId}}
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityComment.comment')" prop="comment">
        {{dataForm.comment}}
      </el-form-item>
      <el-form-item :label="$t('manage.commodity.commodityComment.imgs')" prop="imgs">
        <!--        <el-input v-model="dataForm.commodityId" placeholder="商品id"></el-input>-->
        <div v-for="item in dataForm.imgs" class="goodsImg">
          <img :src="global.showUrl+item" width="100px" hight="100px">
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {commodityComment} from '@/action/commoditycomment'

  export default {
    data() {
      return {
        visible: false,
        dataForm: {
          id: 0,
          transactionId: '',
          comment: '',
          imgs: []
        },
        // dataRule: {
        //   userId: [
        //     { required: true, message: '不能为空', trigger: 'blur' }
        //   ],
        //   transactionId: [
        //     { required: true, message: '交易订单号不能为空', trigger: 'blur' }
        //   ],
        //   commodityId: [
        //     { required: true, message: '商品id不能为空', trigger: 'blur' }
        //   ]
        // }
      }
    },
    methods: {
      init(id, transactionId, comment) {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.dataForm.id = id;
          this.dataForm.transactionId = transactionId;
          this.dataForm.comment = comment;
          if (id) {
            commodityComment.getFile(id).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.id = id;
                this.dataForm.imgs = data.imgs;
                this.dataForm.transactionId = transactionId;
                this.dataForm.comment = comment;
              }
            })
          }
        })
      },
      close(){
        this.$emit('refreshDataList')
      }
      // // 表单提交
      // dataFormSubmit () {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       var params = {
      //         'id': this.dataForm.id || undefined,
      //         'userId': this.dataForm.userId,
      //         'transactionId': this.dataForm.transactionId,
      //         'commodityId': this.dataForm.commodityId
      //       }
      //       var tick = !this.dataForm.id ? commodityComment.add(params) : commodityComment.update(params)
      //       tick.then(({data}) => {
      //         if (data && data.code === 200) {
      //           this.$message({
      //             message: '操作成功',
      //             type: 'success',
      //             duration: 1500,
      //             onClose: () => {
      //               this.visible = false
      //               this.$emit('refreshDataList')
      //             }
      //           })
      //         } else {
      //           this.$message.error(data.msg)
      //         }
      //       })
      //     }
      //   })
      // }
    }
  }
</script>
<style scoped>
  >>> .el-form-item__content {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .goodsImg {
    margin-right: 15px;
  }

  .goodsImg img {
    width: 100px;
    height: 100px;
  }
</style>
