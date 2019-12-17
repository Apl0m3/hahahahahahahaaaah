import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const usertransactionrecord = {

// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/usertransactionrecord/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/save'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/update'),
    method: 'post',
    params: http.adornParams(params)
  }),

   // 删除
  del: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/delete'),
    method: 'post',
    data: http.adornData(params, false)
  }),
  //发货
  ship: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/ship'),
    method: 'post',
    data: http.adornData(params)
  }),
  //获取物流公司
  getCompany: () => http({
    url: http.adornUrl('/manage/usertransactionrecord/getCompany'),
    method: 'get',
  }),
  //获取配送员
  queryDeliveryStaff: () => http({
    url: http.adornUrl('/manage/usertransactionrecord/queryDeliveryStaff'),
    method: 'get',
  }),
  // 退款
  refund: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/updateTransactionRefund'),
    method: 'post',
    params: http.adornParams(params, false)
  }),
  updateStatus: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/updateStatus'),
    method: 'post',
    params: http.adornParams(params, false)
  }),
  queryDelivery: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/queryDelivery'),
    method: 'get',
    params: http.adornParams(params, false)
  }),
  delivery: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/delivery'),
    method: 'post',
    data: http.adornData(params, false)
  }),
  reviewManuscript: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/reviewManuscript'),
    method: 'post',
    data: http.adornData(params, false)
  }),
  queryManuscriptInfo: (params) => http({
    url: http.adornUrl('/manage/usertransactionrecord/queryManuscriptInfo'),
    method: 'get',
    params: http.adornParams(params, false)
  }),
  monthlySales: () => http({
    url: http.adornUrl('/manage/usertransactionrecord/monthlySales'),
    method: 'get',
    params: http.adornParams({}, false)
  }),
}
