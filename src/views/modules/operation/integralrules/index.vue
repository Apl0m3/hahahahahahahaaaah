<template>
  <div class="mod-config">
<!--    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
<!--      <el-form-item>-->
<!--        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button @click="getDataList()">查询</el-button>-->
<!--&lt;!&ndash;        <el-button v-if="isAuth('manage:integralrules:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;        <el-button v-if="isAuth('manage:integralrules:delete')" type="danger" @click="deleteHandle()"&ndash;&gt;-->
<!--&lt;!&ndash;                   :disabled="dataListSelections.length <= 0">批量删除&ndash;&gt;-->
<!--&lt;!&ndash;        </el-button>&ndash;&gt;-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">

<!--      <el-table-column-->
<!--        prop="id"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="编号">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="ruleType"
        header-align="center"
        align="center"
        :label="$t('manage.operation.integralRules.ruleType')">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.ruleType==1">{{$t('manage.operation.integralRules.integral')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        :label="$t('manage.operation.integralRules.type')">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type==1">{{$t('manage.operation.integralRules.type1')}}</el-tag>
          <el-tag size="small" v-if="scope.row.type==2">{{$t('manage.operation.integralRules.type2')}}</el-tag>
          <!--<el-tag size="small" v-if="scope.row.type==3">最高抵扣规则</el-tag>-->
          <!--<el-tag size="small" v-if="scope.row.type==4">邀请返积分规则</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="condition"
        header-align="center"
        align="center"
        :label="$t('manage.operation.integralRules.condition')">
        <template slot-scope="scope">
          <el-tag size="small">{{getRule(scope.row.type,scope.row.factor,scope.row.result)}}</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="result"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="结果">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :label="$t('common.createTime')">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="createSysUserName"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="创建用户">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="updateTime"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="修改时间">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="updateSysUserName"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="修改用户">-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('common.update')}}</el-button>
<!--          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
  import {integralrules} from '@/action/integralrules'
  import AddOrUpdate from './add-or-update'

  export default {
    data() {
      return {
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
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        let params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        };
        integralrules.list(params).then(({data}) => {
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
      getRule(type,factor,result){
        if(type === 1){
          let rule = this.$t('manage.operation.integralRules.rule1');
          rule = rule.replace('factor',factor)
          rule = rule.replace('result',result)
          return rule;
        }else if(type === 2){
          let rule = this.$t('manage.operation.integralRules.rule2');
          rule = rule.replace('factor',factor)
          rule = rule.replace('result',result)
          return rule;
        }
      },
      // 删除
      // deleteHandle(id) {
      //   let ids = id ? [id] : this.dataListSelections.map(item => {
      //     return item.id
      //   });
      //   this.$confirm(`确定进行[删除]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     integralrules.del({'ids':ids}).then(({data}) => {
      //       if (data && data.code === 200) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.getDataList()
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   })
      // }
    }
  }
</script>
