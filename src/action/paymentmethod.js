import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const paymentmethod = {
// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/paymentmethod/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/paymentmethod/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/paymentmethod/save'),
    method: 'post',
    params: http.adornParams(params,false)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/paymentmethod/update'),
    method: 'post',
    data: http.adornData(params,false)
  }),

    // 删除
  del: (params) => http({
    url: http.adornUrl('/manage/paymentmethod/delete'),
    method: 'post',
    data: http.adornData(params, false)
  }),

  disableEnable: (params) => http({
    url: http.adornUrl('/manage/paymentmethod/disableEnable'),
    method: 'post',
    params: http.adornParams(params, false)
  })
}
