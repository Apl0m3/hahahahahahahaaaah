import http from '../utils/httpRequest'
import isInteger from 'lodash/isInteger'


export const coupon={
    // 获取列表
   list:(params) => http({
    url:  http.adornUrl('/manage/coupon/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
   }),
    // 获取信息
    info:(id) =>http({
        url:  http.adornUrl('/manage/coupon/info' + (isInteger(id) ? `/${id}` : '')),
        method: 'get',
        params: http.adornParams({}, 'get')
    }),
// 添加
    add:(params) =>http({
        url:  http.adornUrl('/manage/coupon/save'),
        method: 'post',
        data: http.adornData(params)
    }),

// 修改
  update:(params) =>http({
    url:  http.adornUrl('/manage/coupon/update'),
    method: 'post',
    data: http.adornData(params)
    }),

  // 删除
  del: (params) => http({
    url: http.adornUrl('/manage/coupon/delete'),
    method: 'get',
    params: http.adornParams(params, 'get')
  }),
  // 获取优惠卷类型数据
  getCouponType:() =>http({
    url: http.adornUrl('/manage/coupon/getCouponType'),
    method: 'post',
    // data: http.adornData(params, 'post', false)
  }),
  ////获取商品类型数据
  getCommodityId:() =>http({
    url: http.adornUrl('/manage/coupon/getCommodityId'),
    method: 'post',
    // data: http.adornData(params, 'post', false)
  }),
  ////获取用户数据列表
  getUserList:() =>http({
    url: http.adornUrl('/manage/coupon/getUserList'),
    method: 'post',
    // data: http.adornData(params, 'post', false)
  }),

  ////获取用户数据列表
  getUserListByName:(params) =>http({
    url: http.adornUrl('/manage/coupon/getUserListByName'),
    method: 'get',
    params: http.adornParams(params, false)
  }),
  // 添加
  getCommodity: (params) => http({
    url: http.adornUrl('/manage/commodity/getCommodityByName'),
    method: 'get',
    params: http.adornParams(params, false)
  }),
}
