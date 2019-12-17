import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const userCollection = {

// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/usercollection/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/usercollection/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/usercollection/save'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/usercollection/update'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/usercollection/delete'),
    method: 'post',
    params: http.adornParams(params, false)
  })
}
