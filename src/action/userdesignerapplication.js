import http from '../utils/httpRequest'
import isInteger from 'lodash/isInteger'

export const userdesignerapplication = {
    // 获取列表
  list: (params) => http({
    url: http.adornUrl('/manage/userdesignerapplication/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  }),
    // 获取信息
  info: (id) => http({
    url: http.adornUrl('/manage/userdesignerapplication/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  }),
// 添加
  add: (params) => http({
    url: http.adornUrl('/manage/userdesignerapplication/save'),
    method: 'post',
    data: http.adornData(params)
  }),

// 修改
  update: (params) => http({
    url: http.adornUrl('/manage/userdesignerapplication/approval'),
    method: 'post',
    data: http.adornData(params)
  }),

// 删除
  del: (params) => http({
    url: http.adornUrl('/manage/userdesignerapplication/delete'),
    method: 'post',
    data: http.adornData(params, 'post', false)
  }),
//查询商品分类
  getTypeList: () => http({
    url: http.adornUrl('/manage/userdesignerapplication/getTypeList'),
    method: 'post',
    // data: http.adornData(params, 'post', false)
  }),
  //查询商品分类
  getcommissionDto: () => http({
    url: http.adornUrl('/manage/userdesignerapplication/getcommissionDto'),
    method: 'post',
    // data: http.adornData(params, 'post', false)
  })
}
