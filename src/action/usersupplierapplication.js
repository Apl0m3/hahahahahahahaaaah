import http from '../utils/httpRequest'
import isInteger from 'lodash/isInteger'

export const usersupplierapplication = {
    // 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/usersupplierapplication/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  }),
    // 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/usersupplierapplication/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  }),
// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/usersupplierapplication/save'),
    method: 'post',
    data: http.adornData(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/usersupplierapplication/approval'),
    method: 'post',
    data: http.adornData(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/usersupplierapplication/delete'),
    method: 'post',
    data: http.adornData(params, 'post', false)
  }),
//查询商品分类
  getProList: (id) => http({
    url: http.adornUrl('/manage/usersupplierapplication/getProList'),
    method: 'post',
    data: http.adornData(id,false)
  }),
  //查询商品分类
  getProListCommission: (id) => http({
    url: http.adornUrl('/manage/usersupplierapplication/getProListCommission'),
    method: 'post',
    data: http.adornData(id,false)
  })
}
