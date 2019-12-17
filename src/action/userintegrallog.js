import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const userintegrallog = {

// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/userintegrallog/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/userintegrallog/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/userintegrallog/save'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/userintegrallog/update'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/userintegrallog/delete'),
    method: 'post',
    params: http.adornParams(params, false)
  })
}
