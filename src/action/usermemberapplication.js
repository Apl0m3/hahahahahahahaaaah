import http from '../utils/httpRequest'
import isInteger from 'lodash/isInteger'


export const userMemberApplication={
    // 获取列表
   list:(params) => http({
    url:  http.adornUrl('/manage/usermemberapplication/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
   }),
    // 获取信息
    info:(id) =>http({
        url:  http.adornUrl('/manage/usermemberapplication/info' + (isInteger(id) ? `/${id}` : '')),
        method: 'get',
        params: http.adornParams({}, 'get')
    }),
// 添加
    add:(params) =>http({
        url:  http.adornUrl('/manage/usermemberapplication/save'),
        method: 'post',
        data: http.adornData(params)
    }),

// 修改
  update:(params) =>http({
    url:  http.adornUrl('/manage/usermemberapplication/update'),
    method: 'post',
    data: http.adornData(params)
    }),


// 删除
  saveDiscount:(params) =>http({
    url: http.adornUrl('/manage/usermemberapplication/saveDiscount'),
    method: 'post',
    data: http.adornData(params)
    }),
  // 添加
  getUser: (params) => http({
    url: http.adornUrl('/manage//usermemberapplication/getUser'),
    method: 'get',
    params: http.adornParams(params, false)
  }),

//查询商品分类
  getTypeList: (params) => http({
    url: http.adornUrl('/manage/usermemberapplication/getTypeList'),
    method: 'post',
    params: http.adornParams(params)
  }),
}
