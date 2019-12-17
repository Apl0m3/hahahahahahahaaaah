<template>
  <el-dialog
    :title="$t('manage.usermanage.userAgent.detail.title')"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <template v-for="(item,index) in dataForm.tableData">
        <el-row>
          <el-col :span="7">
            <el-form-item label="商品类型"
                          label-width="100px">
              <span>{{item.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" >
            <el-form-item label="折扣率"
                          label-width="100px" :prop="'tableData.'+index+'.discount'"
                          :rules="rule">
              <el-input v-model.trim="item.discount"
                        placeholder="请输入折扣率">
                <template slot="append">%</template>
              </el-input>

            </el-form-item>
          </el-col>
        </el-row>
      </template>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
      <el-button  type="primary" @click="dataFormSubmit()" >{{$t('common.comfirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {userMemberApplication} from '../../../../action/usermemberapplication'
  import {userdesignerapplication} from '../../../../action/userdesignerapplication'
  export default {
    data() {
      return {
        rule: {
          required: true,
          validator: (rule, value, callback) => {
            if (value == "" || value == "0.00") {
              callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')));
            } else {
              let reg = /^[0-9]+([.]{1}[0-9]{0,2})?$/;
              if (!reg.test(value)) {
                callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')));
              } else {
                if(Number(value) > 0 && Number(value) <= 100){
                  callback();
                }else {
                  callback(new Error(this.$t('manage.usermanage.usersupplierapplication.detail.inputError')));
                }

              }
            }
          },
          trigger: "blur"
        },
        visible: false,
        repeatVisible:false,
        dataForm: {
          id:0,
          tableData:[],
        },
      }
    },
    methods: {
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.repeatVisible = true
            let params = {
              'discountDtoList': this.dataForm.tableData,
              'userId':this.dataForm.id
            };
            let tick = userMemberApplication.saveDiscount(params);
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
      },
      //获取商品分类列表
      getTypeList(id) {
        this.$nextTick(() => {
          this.dataForm.id = id
          let params = {
            'userId': this.dataForm.id
          };
          this.visible = true
          userMemberApplication.getTypeList(params).then(({data}) => {
            if (data && data.code === 200) {
              for (let i = 0; i < data.typeList.length ; i++) {
                data.typeList[i].userId = id;
              }
              this.dataForm.tableData = data.typeList
            } else {
              // console.log(this.$t('common.wrong'))
            }
          })
        })

      },
    }
  }
</script>
