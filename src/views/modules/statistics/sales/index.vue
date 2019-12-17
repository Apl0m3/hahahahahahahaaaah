<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select
          v-model="dataForm.commodityNameId"
          filterable
          remote
          :clearable="clearable"
          reserve-keyword
          :placeholder="$t('manage.operation.advertisement.addOrupdate.commodityName')"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="dataForm.value2"
          type="datetimerange"
          align="right"
          unlink-panels
          :clearable="clearable"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="-"
          :start-placeholder="$t('manage.statistics.sales.startDate')"
          :end-placeholder="$t('manage.statistics.sales.startDate')"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  @click="getDataList()">{{$t('common.select')}}</el-button>
        <!--        <el-button v-if="isAuth('operation:operateRate:save')" type="primary" @click="addOrUpdateHandle()">{{$t('common.add')}}</el-button>-->
        <!--<el-button v-if="isAuth('coupon:coupon:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        :label="$t('manage.statistics.sales.name')"
      >
      </el-table-column>
      <el-table-column
        prop="soldNum"
        header-align="center"
        align="center"
        :label="$t('manage.statistics.sales.quantity')"
      >
      </el-table-column>
<!--      <el-table-column-->
<!--        fixed="right"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="150"-->
<!--        :label="$t('common.operation')">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="text" v-if="isAuth('coupon:coupon:delete')" size="small" @click="addOrUpdateHandle(scope.row.id)">{{$t('manage.operation.rate.edit')}}</el-button>-->
<!--          &lt;!&ndash;          <el-button type="text" v-if="isAuth('coupon:coupon:delete')" size="small" @click="deleteHandle(scope.row)">{{$t('manage.operation.rate.delete')}}</el-button>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
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
<!--    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->
  </div>
</template>

<script>
    import {sales} from '../../../../action/sales'
    import {advertisement} from '@/action/advertisement'
    export default {
        data () {
            return {
                clearable:true,
                dataForm: {
                    type:'',
                    rate:'',
                    create_at:'',
                    commodityNameId:'',
                    value2:[],
                },
                pickerOptions: {
                    shortcuts: [{
                        text: this.$t('manage.statistics.sales.text1'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: this.$t('manage.statistics.sales.text2'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: this.$t('manage.statistics.sales.text3'),
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value1: '',
                value2: '',
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false,
                options:[],
                loading:false,
            }
        },
        activated () {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList () {
                this.dataListLoading = true;

                let params = {
                    page: this.pageIndex,
                    limit: this.pageSize,
                    'type': this.dataForm.type,
                    'commodityNameId':this.dataForm.commodityNameId,
                    'startDate':this.dataForm.value2==null?'':this.dataForm.value2[0],
                    'endDate':this.dataForm.value2==null?'':this.dataForm.value2[1],
                };
                sales.list(params).then(({data}) => {
                    if (data && data.code === 200) {
                        this.dataList = data.page.page.list;
                        this.totalPage = data.page.page.totalCount
                    } else {
                        this.dataList = [];
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
            remoteMethod (query) {
                this.loading = true
                if (query !== '') {
                    advertisement.getCommodity({name: query}).then(({data}) => {
                        if (data && data.code === 200) {
                            this.loading = false;
                            this.options = data.list
                        }
                    })
                }
            },
        }
    }
</script>
