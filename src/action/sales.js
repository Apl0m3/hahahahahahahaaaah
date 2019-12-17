import http from '../utils/httpRequest'
import isInteger from 'lodash/isInteger'


export const sales={
  // 获取列表
  list:(params) => http({
    url:  http.adornUrl('/manage/operate/sales/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  }),

}
