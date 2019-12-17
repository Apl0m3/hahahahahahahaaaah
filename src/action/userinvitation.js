import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const userinvitation = {

// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/userinvitation/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/userinvitation/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/userinvitation/save'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/userinvitation/update'),
    method: 'post',
    params: http.adornParams(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/userinvitation/delete'),
    method: 'post',
    params: http.adornParams(params, false)
  })
}
