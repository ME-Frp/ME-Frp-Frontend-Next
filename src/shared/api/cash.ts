import baseApi from './config'
import type { ApiResponse } from './config'
import type { CreateOrderRequest, CreateOrderResponse, SubmitOrderRequest, SubmitOrderResponse, QueryOrderResponse } from '../../types'

export const CashApi = {
  // 创建订单
  createOrder: (data: CreateOrderRequest) => {
    return baseApi.post<ApiResponse<CreateOrderResponse>>('/cash/create', data)
  },

  // 页面跳转支付
  submitOrder: (data: SubmitOrderRequest) => {
    return baseApi.post<ApiResponse<SubmitOrderResponse>>('/cash/submit', data)
  },

  // 查询订单
  queryOrder: (orderId: string) => {
    return baseApi.post<ApiResponse<QueryOrderResponse>>('/cash/query', { orderId })
  }
}

export default CashApi
