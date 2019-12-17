<template>
  <div class="mod-config">
    <el-dialog
      title="属性列表"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList(this.commodityId)">
      <el-form-item>
        <el-button v-if="isAuth('commodity:commodityattributes:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="属性名称">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="属性类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" size="small" >文字描述</el-tag>
          <el-tag v-if="scope.row.type === 2" size="small" >图片</el-tag>
          <el-tag v-if="scope.row.type === 3" size="small" >图文</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"  @click="queryAttributesValue(scope.row.id,scope.row.type)">设置属性值</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination-->
      <!--@size-change="sizeChangeHandle"-->
      <!--@current-change="currentChangeHandle"-->
      <!--:current-page="pageIndex"-->
      <!--:page-sizes="[10, 20, 50, 100]"-->
      <!--:page-size="pageSize"-->
      <!--:total="totalPage"-->
      <!--layout="total, sizes, prev, pager, next, jumper">-->
    <!--</el-pagination>-->
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <attributes-value-index v-if="attributesValueIndex" ref="attributesValueIndex" ></attributes-value-index>
  </div>
</template>

<script>
  import {commodityattributes} from '@/action/commodityattributes'
  import AddOrUpdate from './add-or-update'
  import AttributesValueIndex from '../commodityattributesvalue/attributes-value-index'
  export default {
    data () {
      return {
        attributesValueIndex: false,
        commodityId: '',
        visible: false,
        dataForm: {
          key: ''
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
      AttributesValueIndex,
      AddOrUpdate
    },
    // activated () {
    //   this.getDataList()
    // },
    methods: {
      // 获取数据列表
      getDataList (id) {
        this.dataListLoading = true
        this.visible = true
        this.commodityId = id
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          commodityId: this.commodityId
        }
        commodityattributes.list(params).then(({data}) => {
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
        this.getDataList(this.commodityId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.commodityId)
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改 attributesValueIndex
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.commodityId, id)
        })
      },
      // 属性值
      queryAttributesValue (id, tpye) {
        this.attributesValueIndex = true
        this.$nextTick(() => {
          this.$refs.attributesValueIndex.getDataList(id, tpye, this.commodityId)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          commodityattributes.del(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList(this.commodityId)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
