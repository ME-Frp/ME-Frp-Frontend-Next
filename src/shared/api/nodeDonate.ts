import baseApi from './config';
import type { ApiResponse } from './config';
import type { 
  NodeDonate, 
  ApplyNodeDonateArgs, 
  NodeDeleteRequest, 
  ApplyNodeDeleteArgs,
  ApproveNodeDonateArgs,
  RejectNodeDonateArgs,
  ApproveNodeDeleteRequestArgs,
  RejectNodeDeleteRequestArgs
} from '../../types'

// 用户相关API

/**
 * 申请捐赠节点
 * @param data 节点捐赠申请数据
 */
export function applyNodeDonate(data: ApplyNodeDonateArgs) {
  return baseApi.post<ApiResponse<NodeDonate>>('/auth/node/donate', data)
}

/**
 * 获取用户的节点捐赠申请列表
 */
export function getUserNodeDonates() {
  return baseApi.get<ApiResponse<NodeDonate[]>>('/auth/node/donate/list')
}

/**
 * 申请删除节点
 * @param data 节点删除申请数据
 */
export function applyNodeDelete(data: ApplyNodeDeleteArgs) {
  return baseApi.post<ApiResponse<NodeDeleteRequest>>('/auth/node/delete/apply', data)
}

/**
 * 获取用户的节点删除申请列表
 */
export function getUserNodeDeleteRequests() {
  return baseApi.get<ApiResponse<NodeDeleteRequest[]>>('/auth/node/delete/list')
}

// 管理员相关API

/**
 * 获取所有节点捐赠申请
 */
export function getAllNodeDonates() {
  return baseApi.get<ApiResponse<NodeDonate[]>>('/admin/node/donate/list')
}

/**
 * 获取待审核的节点捐赠申请
 */
export function getPendingNodeDonates() {
  return baseApi.get<ApiResponse<NodeDonate[]>>('/admin/node/donate/pending')
}

/**
 * 通过节点捐赠申请
 * @param data 包含申请ID的数据
 */
export function approveNodeDonate(data: ApproveNodeDonateArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/donate/approve', data)
}

/**
 * 拒绝节点捐赠申请
 * @param data 包含申请ID和拒绝原因的数据
 */
export function rejectNodeDonate(data: RejectNodeDonateArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/donate/reject', data)
}

/**
 * 获取所有节点删除申请
 */
export function getAllNodeDeleteRequests() {
  return baseApi.get<ApiResponse<NodeDeleteRequest[]>>('/admin/node/delete/list')
}

/**
 * 获取待审核的节点删除申请
 */
export function getPendingNodeDeleteRequests() {
  return baseApi.get<ApiResponse<NodeDeleteRequest[]>>('/admin/node/delete/pending')
}

/**
 * 通过节点删除申请
 * @param data 包含申请ID的数据
 */
export function approveNodeDeleteRequest(data: ApproveNodeDeleteRequestArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/delete/approve', data)
}

/**
 * 拒绝节点删除申请
 * @param data 包含申请ID和拒绝原因的数据
 */
export function rejectNodeDeleteRequest(data: RejectNodeDeleteRequestArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/delete/reject', data)
} 