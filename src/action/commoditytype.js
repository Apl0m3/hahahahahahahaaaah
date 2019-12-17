import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const commoditytype = {
// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/commoditytype/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

  // 获取列表
  listAll: () => http({
    url: http.adornUrl('/manage/commoditytype/listAll'),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/commoditytype/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),
// 获取信息
  getFirstType: () => http({
    url: http.adornUrl('/manage/commoditytype/getFirstType'),
    method: 'get',
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/commoditytype/save'),
    method: 'post',
    data: http.adornData(params, false)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/commoditytype/update'),
    method: 'post',
    data: http.adornData(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/commoditytype/delete'),
    method: 'post',
    data: http.adornData(params, false)
  })
}
