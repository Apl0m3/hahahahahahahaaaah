import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const commodity = {
  // 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/commodity/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/commodity/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),
  // 获取信息
  integralInfo: (id) => http({
    url: http.adornUrl('/manage/commodity/integralInfo' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/commodity/save'),
    method: 'post',
    data: http.adornData(params)
  }),

  // 添加积分商品
  addIn: (params) => http({
    url: http.adornUrl('/manage/commodity/saveIntegralCommodity'),
    method: 'post',
    data: http.adornData(params)
  }),

// 修改积分商品
  updateIn: (params) => http({
    url: http.adornUrl('/manage/commodity/updateIntegralCommodity'),
    method: 'post',
    data: http.adornData(params, false)
  }),


// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/commodity/update'),
    method: 'post',
    data: http.adornData(params, false)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/commodity/delete'),
    method: 'post',
    data: http.adornData(params, false)
  }),

  //商家下架
  updateStatus: (params) => http({
    url: http.adornUrl('/manage/commodity/updateStatus'),
    method: 'post',
    data: http.adornData(params, false)
  }),
  //商家下架
  pointDeduction: (params) => http({
    url: http.adornUrl('/manage/commodity/pointDeduction'),
    method: 'post',
    data: http.adornData(params, false)
  }),
  Recommend: (id,status) => http({
    url: http.adornUrl('/manage/commodity/recommend?id='+id+"&status="+status),
    method: 'get',
  })
}
