import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const userintegral = {

// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/userintegral/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/userintegral/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/userintegral/save'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/userintegral/update'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/userintegral/delete'),
    method: 'post',
    params: http.adornParams(params, false)
  })
}
