import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const usercommoditycart = {
  // 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/usercommoditycart/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/usercommoditycart/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/usercommoditycart/save'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/usercommoditycart/update'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/usercommoditycart/delete'),
    method: 'post',
    params: http.adornParams(params, false)
  })

}
