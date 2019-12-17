<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" :placeholder="$t('manage.coupon.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{$t('common.select')}}</el-button>
        <el-button v-if="isAuth('coupon:coupon:save')" type="primary" @click="addOrUpdateHandle()">
          {{$t('common.add')}}
        </el-button>
        <!--<el-button v-if="isAuth('coupon:coupon:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column-->
      <!--type="selection"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--width="50">-->
      <!--</el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="id"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        :label="$t('common.num')">-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.coupon.name')"
      >
      </el-table-column>
      <el-table-column
        prop="couponTypeName"
        header-align="center"
        align="center"
        :label="$t('manage.coupon.couponType')"
      >
        <!--<template slot-scope="scope">-->
        <!--<el-tag v-if="scope.row.couponType===1">{{$t("manage.coupon.yhj")}}</el-tag>-->
        <!--<el-tag v-if="scope.row.couponType===2">{{$t("manage.coupon.reduce")}}</el-tag>-->
        <!--</template>-->
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="receiveStartAt"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="领取开始时间">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="receiveEndAt"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="领取结束时间">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="useStartAt"
        header-align="center"
        align="center"
        :formatter="createAtTypeFormat"
        :label="$t('manage.coupon.useStartAt')"
      >
      </el-table-column>
      <el-table-column
        prop="useEndAt"
        header-align="center"
        align="center"
        :formatter="endAtTypeFormat"
        :label="$t('manage.coupon.useEndAt')">
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="deleteStatus"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--:label="$t('manage.coupon.deleteStatus')">-->
      <!--</el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="surplusNum"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        :label="$t('manage.coupon.surplusNum')">-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="totalNum"
        header-align="center"
        align="center"
        :label="$t('manage.coupon.totalNum')">
      </el-table-column>
      <el-table-column
        prop="regulation"
        header-align="center"
        align="center"
        :label="$t('manage.coupon.condition')">
      </el-table-column>
      <el-table-column
        prop="result"
        header-align="center"
        align="center"
        :label="$t('manage.coupon.result')">
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="instructions"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="使用说明">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="country"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="国家">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="general"
        header-align="center"
        align="center"

        :label="$t('manage.coupon.general')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.general===0">{{$t("manage.coupon.no")}}</el-tag>
          <el-tag v-if="scope.row.general===1">{{$t("manage.coupon.yes")}}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="image"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="图片">-->
      <!--</el-table-column>-->

      <el-table-column
        prop="image"
        header-align="center"
        align="center"
        :label="$t('manage.coupon.image')">
        <template slot-scope="scope">
          <img :src="global.showUrl+scope.row.image" alt="" style="width: 50px;height: 50px"
               v-if="scope.row.image!==null">
          <img src="../../../../../static/img/userHead.svg" v-else>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="ceiling"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="折扣金额 最高限额">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="qrcode"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="terms"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="条款">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="createAt"
        header-align="center"
        align="center"
        :formatter="createAtTypeFormat"
        :label="$t('manage.coupon.createAt')">
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="createBy"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="updateAt"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="updateBy"-->
      <!--header-align="center"-->
      <!--align="center"-->
      <!--label="">-->
      <!--</el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" v-if="isAuth('coupon:coupon:delete')" size="small"
                     @click="addOrUpdateHandle(scope.row.id)">{{$t('common.showDet')}}
          </el-button>
          <el-button type="text" v-if="isAuth('coupon:coupon:delete')" size="small" @click="deleteHandle(scope.row)">
            {{$t('common.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
    import {coupon} from '@/action/coupon'
    import AddOrUpdate from './add-or-update'

    export default {
        data() {
            return {
                dataForm: {
                    name: '',
                },
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false
            }
        },
        components: {
            AddOrUpdate
        },
        activated() {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                var params = {
                    page: this.pageIndex,
                    limit: this.pageSize,
                    name: this.dataForm.name
                }
                coupon.list(params).then(({data}) => {
                    if (data && data.code === 200) {
                        this.dataList = data.page.list
                        this.totalPage = data.page.totalCount
                    } else {
                        // console.log('wrong')
                        this.dataList = []
                        this.totalPage = 0
                    }
                    this.dataListLoading = false
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getDataList()
            },
            // 多选
            selectionChangeHandle(val) {
                this.dataListSelections = val
            },
            // 新增 / 修改
            addOrUpdateHandle(id) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },
            // 删除
            deleteHandle(row) {
                // console.log(row)
                let title = row.name
                let content1 = this.$t('manage.coupon.buttonOperation.content1');
                content1 = content1.replace("title", title)
                this.$confirm(content1, this.$t('common.tips'), {
                    confirmButtonText: this.$t("common.comfirm"),
                    cancelButtonText: this.$t("common.cancel"),
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id: row.id
                    }
                    coupon.del(params).then(({data}) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: this.$t("common.success"),
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })
            },
            createAtTypeFormat(val) {
                let date = new Date(val.useStartAt)
                var year = date.getFullYear()
                var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
                var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
                var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
            },
            endAtTypeFormat(val) {
                let date = new Date(val.useEndAt);
                var year = date.getFullYear()
                var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
                var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
                var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
                return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
            }
        }
    }
</script>
