import http from '../utils/httpRequest'

import isInteger from 'lodash/isInteger'

export const commoditynum={
    // 获取列表
   list:(params) => http({
    url:  http.adornUrl('/manage/commoditynum/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
   }),
    // 获取信息
    info:(id) =>http({
        url:  http.adornUrl('/manage/commoditynum/info' + (isInteger(id) ? `/${id}` : '')),
        method: 'get',
        params: http.adornParams({}, 'get')
    }),
// 添加
    add:(params) =>http({
        url:  http.adornUrl('/manage/commoditynum/save'),
        method: 'post',
        data: http.adornData(params)
    }),

// 修改
  update:(params) =>http({
    url:  http.adornUrl('/manage/commoditynum/update'),
    method: 'post',
    data: http.adornData(params)
    }),


// 删除
 del:(params) =>http({
        url: http.adornUrl('/manage/commoditynum/delete'),
        method: 'post',
        data: http.adornData(params, false)
    })

}
