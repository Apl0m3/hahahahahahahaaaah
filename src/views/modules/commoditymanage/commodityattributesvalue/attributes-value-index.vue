<template>
  <div class="mod-config">
    <el-dialog
      title="属性值列表"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="this.getDataList(this.commodityAttributesId)">
      <el-form-item>
        <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        label="名称">
      </el-table-column>
      <el-table-column
        v-if="type"
        prop="url"
        header-align="center"
        align="center"
        label="属性图片">
        <template slot-scope="scope">
          <img v-if="scope.row.url" width="100px" height="100px" :src="global.showUrl+scope.row.url"/>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import {commodityattributesvalue} from '@/action/commodityattributesvalue'
  import AddOrUpdate from './add-or-update'
  export default {
    data () {
      return {
        commodityId: '',
        type: true,
        type1: '',
        commodityAttributesId: '',
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
      AddOrUpdate
    },
    // activated () {
    //   this.getDataList()
    // },
    methods: {
      // 获取数据列表
      getDataList (id, type, commodityId) {
        this.dataListLoading = true
        this.visible = true
        this.commodityId = commodityId
        this.commodityAttributesId = id
        this.type1 = type
        if (type === 1) {
          this.type = false
        }
        console.log(this.type)
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          commodityAttributesId: this.commodityAttributesId
        }
        commodityattributesvalue.list(params).then(({data}) => {
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
        this.getDataList(this.commodityAttributesId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.commodityAttributesId)
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.commodityAttributesId, id, this.type1, this.commodityId)
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
          commodityattributesvalue.del(ids).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList(this.commodityAttributesId)
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
