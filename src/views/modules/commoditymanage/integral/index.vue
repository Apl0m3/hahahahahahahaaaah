<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
      <!--请输入商品名称--><el-input v-model="dataForm.name" :placeholder="$t('manage.commodity.commodity1.nameCondition')" clearable></el-input>
    </el-form-item>
      <el-form-item>
        <!--请选择商品状态--><el-select  :placeholder="$t('manage.commodity.commodity1.statusCondition')" v-model="dataForm.status" :clearable="true">
          <el-option-group>
            <!--上架--><el-option :value="0" :label="$t('manage.commodity.commodity1.grounding')">{{$t('manage.commodity.commodity1.grounding')}}</el-option>
            <!--下架--><el-option :value="1" :label="$t('manage.commodity.commodity1.undercarriage')">{{$t('manage.commodity.commodity1.undercarriage')}}</el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item >
        <!--请选择商品分类--><el-select v-model="dataForm.commodityTypeId" :clearable="true" :placeholder="$t('manage.commodity.commodity1.classification')"  @change="selectOne"  :disabled="dataForm.id!== undefined">
          <el-option
            v-for="item in typeIds"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>-->
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!--查询--><el-button @click="getDataList()">{{$t('manage.commodity.commodity1.query')}}</el-button>
        <!--新增--><el-button v-if="isAuth('manage:commodity:save')" type="primary" @click="addOrUpdateHandle()">{{$t('manage.commodity.commodity1.newAdd')}}</el-button>
        <!--        <el-button v-if="isAuth('manage:commodity:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">

      <!--编号-->
<!--      <el-table-column-->
<!--        prop="id"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('manage.commodity.commodity1.id')">-->
<!--      </el-table-column>-->
      <!--商品名称-->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.name')">
      </el-table-column>
<!--      商品数量-->
      <el-table-column
        prop="totalNum"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.addOrUpdate.totalNum')">
      </el-table-column>

      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.amount')">
      </el-table-column>
      <el-table-column
        prop="num"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.num')">
      </el-table-column>
      <!--商品图片--><el-table-column
        prop="image"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.image')">
        <template slot-scope="scope">
          <img width="100px" height="100px" :src="global.showUrl+scope.row.image"/>
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        prop="remark"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        label="分享描述">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column-->
      <!--        prop="description"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        label="商品描述">-->
      <!--      </el-table-column>-->
      <!--商品类型-->
<!--      <el-table-column-->
<!--        prop="type"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        :label="$t('manage.commodity.commodity1.type')">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag v-if="scope.row.type === 1" size="small" >{{$t('manage.commodity.commodity1.generalMerchandise')}}</el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <!--创建人--><el-table-column
        prop="createSysUserName"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.createSysUserName')">
      </el-table-column>
      <!--创建时间--><el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('manage.commodity.commodity1.createTime')">
      </el-table-column>
      <!--操作--><el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('manage.commodity.commodity1.operation')">
        <template slot-scope="scope">
          <!--修改--><el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('manage.commodity.commodity1.modify')}}</el-button>

          <!--上架或下架--><el-button type="text" size="small" @click="updateStatus(scope.row.id,scope.row.status)"><span
            :style="scope.row.status===0?'':'color:red'">{{scope.row.status===0?$t('manage.commodity.commodity1.undercarriage'):$t('manage.commodity.commodity1.grounding')}}</span></el-button>

          <!--删除--> <el-button type="text" size="small" @click="deleteHandle(scope.row)">{{$t('manage.commodity.commodity1.delete')}}</el-button>
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
  import {commodity} from '@/action/commodity'
  import AddOrUpdate from './add-or-update'
  import {commoditytype} from '@/action/commoditytype'

  export default {
    data () {
      return {
        typeIds: [],
        dataForm: {
          name: '',
          status: '',
          commodityTypeId: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        integralVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    mounted(){

    },
    methods: {
      // 获取分类id
      selectOne (id) {
        this.dataForm.commodityTypeId = id
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.selectCommodityType();
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name,
          status: this.dataForm.status,
          commodityTypeId: this.dataForm.commodityTypeId,
          type:2
        };
        commodity.list(params).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 查询商品分类列表
      selectCommodityType(){
        commoditytype.listAll({}).then(({data}) => {
          if (data && data.code === 200) {
            this.typeIds = data.result
          }
        })
      },
      updateStatus (id,status) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        let title = this.$t('prompt.title')// 提示
        let Confirmation = this.$t('manage.commodity.commodity1.Confirmation') // 确认进行
        let operation1 = this.$t('manage.commodity.commodity1.operation1') // 操作？
        let undercarriage = this.$t('manage.commodity.commodity1.undercarriage') // 下架
        let grounding = this.$t('manage.commodity.commodity1.grounding') // 上架
        this.$confirm(`${Confirmation}[${status === 0 ? undercarriage : grounding}]${operation1}`, title, {
          confirmButtonText: this.$t('manage.commodity.commodity1.confirm'),
          cancelButtonText: this.$t('manage.commodity.commodity1.cancel'),
          type: 'warning'
        }).then(() => {
          commodity.updateStatus(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t('manage.commodity.commodity1.success'),
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
        }).catch(err => {

        })
      },
      // 删除
      deleteHandle (row) {
        if (row.status === 0) {
          this.$message.warning(this.$t('manage.commodity.commodity1.warning'))
          return
        }
        let ids = [row.id]
        let title = this.$t('prompt.title')// 提示
        let delete1 = this.$t('manage.commodity.commodity1.delete')// 删除
        let Confirmation = this.$t('manage.commodity.commodity1.Confirmation') // 确认进行
        let operation1 = this.$t('manage.commodity.commodity1.operation1') // 操作？
        this.$confirm(`${Confirmation}[${delete1}]${operation1}`, title, {
          confirmButtonText: this.$t('manage.commodity.commodity1.confirm'),
          cancelButtonText: this.$t('manage.commodity.commodity1.cancel'),
          type: 'warning'
        }).then(() => {
          commodity.del(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t('manage.commodity.commodity1.success'),
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
        }).catch(err => {

        })
      }
    }
  }
</script>
