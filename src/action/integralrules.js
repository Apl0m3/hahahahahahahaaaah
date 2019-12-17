import http from '../utils/httpRequest'
import isInteger from 'lodash/isInteger'

export const integralrules = {
// 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/integralrules/list'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

// 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/integralrules/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, false)
  }),

// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/integralrules/save'),
    method: 'post',
    data: http.adornData(params,false)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/integralrules/update'),
    method: 'post',
    data: http.adornData(params,false)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/integralrules/delete'),
    method: 'post',
    params: http.adornParams(params, false)
  })
}
