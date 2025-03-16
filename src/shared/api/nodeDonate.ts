import baseApi from './config';
import type { ApiResponse } from './config';
import type { 
  NodeDonate, 
  ApplyNodeDonateArgs, 
  NodeDeleteRequest, 
  ApplyNodeDeleteArgs,
  NodeEditRequest,
  ApplyNodeEditArgs,
  GetNodeInstallScriptArgs,
  GetNodeInstallScriptResponse,
  GetSystemArchsResponse
} from '../../types/authApi'
import type {
  ApproveNodeDonateArgs,
  RejectNodeDonateArgs,
  ApproveNodeDeleteRequestArgs,
  RejectNodeDeleteRequestArgs,
  ApproveNodeEditRequestArgs,
  RejectNodeEditRequestArgs
} from '../../types/adminApi'

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
  return baseApi.post<ApiResponse<NodeDeleteRequest>>('/auth/node/donate/delete/apply', data)
}

/**
 * 获取用户的节点删除申请列表
 */
export function getUserNodeDeleteRequests() {
  return baseApi.get<ApiResponse<NodeDeleteRequest[]>>('/auth/node/donate/delete/list')
}

/**
 * 申请编辑节点
 * @param data 节点编辑申请数据
 */
export function applyNodeEdit(data: ApplyNodeEditArgs) {
  return baseApi.post<ApiResponse<NodeEditRequest>>('/auth/node/donate/edit/apply', data)
}

/**
 * 获取用户的节点编辑申请列表
 */
export function getUserNodeEditRequests() {
  return baseApi.get<ApiResponse<NodeEditRequest[]>>('/auth/node/donate/edit/list')
}

/**
 * 获取节点安装脚本
 * @param data 包含节点ID、系统类型和架构的数据
 */
export function getNodeInstallScript(data: GetNodeInstallScriptArgs) {
  return baseApi.post<ApiResponse<GetNodeInstallScriptResponse>>('/auth/node/donate/script', data)
}

/**
 * 下载节点安装脚本
 * @param scriptId 脚本 ID
 */
export function downloadNodeInstallScript(scriptId: string) {
  return `${baseApi.defaults.baseURL}/auth/node/donate/script/download/${scriptId}`
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
  return baseApi.get<ApiResponse<NodeDeleteRequest[]>>('/admin/node/donate/delete/list')
}

/**
 * 获取待审核的节点删除申请
 */
export function getPendingNodeDeleteRequests() {
  return baseApi.get<ApiResponse<NodeDeleteRequest[]>>('/admin/node/donate/delete/pending')
}

/**
 * 通过节点删除申请
 * @param data 包含申请ID的数据
 */
export function approveNodeDeleteRequest(data: ApproveNodeDeleteRequestArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/donate/delete/approve', data)
}

/**
 * 拒绝节点删除申请
 * @param data 包含申请ID和拒绝原因的数据
 */
export function rejectNodeDeleteRequest(data: RejectNodeDeleteRequestArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/donate/delete/reject', data)
}

/**
 * 获取所有节点编辑申请
 */
export function getAllNodeEditRequests() {
  return baseApi.get<ApiResponse<NodeEditRequest[]>>('/admin/node/donate/edit/list')
}

/**
 * 获取待审核的节点编辑申请
 */
export function getPendingNodeEditRequests() {
  return baseApi.get<ApiResponse<NodeEditRequest[]>>('/admin/node/donate/edit/pending')
}

/**
 * 通过节点编辑申请
 * @param data 包含申请ID的数据
 */
export function approveNodeEditRequest(data: ApproveNodeEditRequestArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/donate/edit/approve', data)
}

/**
 * 拒绝节点编辑申请
 * @param data 包含申请ID和拒绝原因的数据
 */
export function rejectNodeEditRequest(data: RejectNodeEditRequestArgs) {
  return baseApi.post<ApiResponse<null>>('/admin/node/donate/edit/reject', data)
} 