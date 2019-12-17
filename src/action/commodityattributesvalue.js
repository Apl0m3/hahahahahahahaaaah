import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const commodityattributesvalue={
    // 获取列表
   list:(params) => http({
    url:  http.adornUrl('/manage/commodityattributesvalue/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
   }),
  // 获取列表2
  list2:(params) => http({
    url:  http.adornUrl('/manage/commodityattributesvalue/list2'),
    method: 'get',
    params: http.adornParams(params, 'get')
  }),
    // 获取信息
    info:(id) =>http({
        url:  http.adornUrl('/manage/commodityattributesvalue/info' + (isInteger(id) ? `/${id}` : '')),
        method: 'get',
        params: http.adornParams({}, 'get')
    }),
// 添加
    add:(params) =>http({
        url:  http.adornUrl('/manage/commodityattributesvalue/save'),
        method: 'post',
        data: http.adornData(params)
    }),

// 修改
  update:(params) =>http({
    url:  http.adornUrl('/manage/commodityattributesvalue/update'),
    method: 'post',
    data: http.adornData(params)
    }),


// 删除
 del:(params) =>http({
        url:  http.adornUrl('/manage/commodityattributesvalue/delete'),
        method: 'post',
        data: http.adornData(params, false)
    })

}
