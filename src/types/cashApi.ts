// 支付方式
export type PayMethod = 'alipay' | 'wxpay' | 'qqpay'

// 创建订单
export interface CreateOrderRequest {
  type: 'traffic' | 'proxy' | 'vip'
  amount: number
  months?: number
  client_ip: string
  pay_method: PayMethod
}

export interface CreateOrderResponse {
  order_id: string
  pay_url: string
  pay_qrcode: string
}

// 页面跳转支付
export interface SubmitOrderRequest {
  type: 'traffic' | 'proxy' | 'vip'
  amount: number
  months?: number
  client_ip: string
  pay_method: PayMethod
  notify_url: string
  return_url: string
}

export interface SubmitOrderResponse {
  payUrl: string
}

// 查询订单

export interface QueryOrderResponse {
  status: number
  orderId: string
  payType: string
  money: string
  payTime: string
  payItem: string
}