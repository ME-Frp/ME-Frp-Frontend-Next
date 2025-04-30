import baseApi from './config'
import type { ApiResponse } from './config'

export interface Ad {
  adsId?: number
  adsOwner?: string
  adsUrl: string
  adsType: string
  adsContent?: string
  adsImageUrl?: string
  adsExpire: number
  adsPlacement: string
  adsClick?: number
}

export const AdsApi = {
  // 获取所有广告
  getAds: () => {
    return baseApi.get<ApiResponse<Ad[]>>('/admin/ads/list').then(res => res.data)
  },

  // 获取用户的广告
  getUserAds: () => {
    return baseApi.get<ApiResponse<Ad[]>>('/auth/ads/manage').then(res => res.data)
  },

  // 根据位置获取广告
  getAdsByPlacement: (placement: string) => {
    return baseApi.get<ApiResponse<Ad[]>>('/auth/ads/query', {
      params: { placement }
    }).then(res => res.data)
  },

  // 添加广告
  addAd: (data: Ad) => {
    return baseApi.post<ApiResponse<void>>('/auth/ads/add', data).then(res => res.data)
  },

  // 更新广告
  updateAd: (data: Ad) => {
    return baseApi.post<ApiResponse<void>>('/auth/ads/update', data).then(res => res.data)
  },

  // 删除广告
  deleteAd: (adsId: number) => {
    return baseApi.post<ApiResponse<void>>('/auth/ads/delete', { adsId }).then(res => res.data)
  },

  // 管理员添加广告
  adminAddAd: (data: Ad) => {
    return baseApi.post<ApiResponse<void>>('/admin/ads/add', data).then(res => res.data)
  },

  // 管理员更新广告
  adminUpdateAd: (data: Ad) => {
    return baseApi.post<ApiResponse<void>>('/admin/ads/update', data).then(res => res.data)
  },

  // 管理员删除广告
  adminDeleteAd: (adsId: number) => {
    return baseApi.post<ApiResponse<void>>('/admin/ads/delete', { adsId }).then(res => res.data)
  },

  // 追踪广告点击
  trackAdClick: (adId: number) => {
    return baseApi.get<ApiResponse<void>>('/auth/ads/track', {
      params: { adId }
    }).then(res => res.data)
  }
} 