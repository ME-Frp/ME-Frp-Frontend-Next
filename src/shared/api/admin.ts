import baseApi from './config'
import type { ApiResponse } from './config';
import type { UserInfo } from '../../types/authApi'
import type { GetUsersData, FilterUsersArgs, UpdateUserArgs, GetNodesData, AddNodeArgs, GetNodesArgs, UpdateNodeArgs, FilterProxiesArgs, GetProxiesData, UpdateProxyArgs, UpdateSystemConfigArgs } from '../../types'

export const AdminApi = {
  // 搜索用户
  filterUsers: (params: FilterUsersArgs) => {
    return baseApi.post<ApiResponse<GetUsersData>>('/admin/user/filter', params)
  },

  // 禁用/启用用户
  toggleUser: (userId: number, isDisabled: boolean) => {
    return baseApi.post<ApiResponse<void>>('/admin/user/toggle', { userId, isDisabled })
  },

  // 获取用户信息
  getUser: (userId: number) => {
    return baseApi.post<ApiResponse<UserInfo>>(`/admin/user/get`, { userId })
  },

  // 更新用户信息
  updateUser: (params: UpdateUserArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/user/update', params)
  },

  // 搜索节点
  filterNodes: (params: GetNodesArgs) => {
    return baseApi.post<ApiResponse<GetNodesData>>('/admin/node/filter', params)
  },

  // 添加节点
  addNode: (config: AddNodeArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/node/add', config)
  },

  // 更新节点信息
  updateNode: (config: UpdateNodeArgs) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/update`, config)
  },

  // 删除节点
  deleteNode: (nodeId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/delete`, { nodeId })
  },

  // 禁用/启用节点
  toggleNode: (nodeId: number, isDisabled: boolean) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/toggle`, { nodeId, isDisabled })
  },

  // 隧道相关
  filterProxies: (params: FilterProxiesArgs) => {
    return baseApi.post<ApiResponse<GetProxiesData>>('/admin/proxy/filter', params)
  },

  // 封禁隧道
  banProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/ban`, { proxyId })
  },

  // 解封隧道
  unbanProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/unban`, { proxyId })
  },

  // 删除隧道
  deleteProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/delete`, { proxyId })
  },

  // 更新隧道信息
  updateProxy: (params: UpdateProxyArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/proxy/update', params)
  },

  // 强制下线隧道
  kickProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/kick`, { proxyId })
  },

  // 禁用/启用隧道
  toggleProxy: (proxyId: number, isDisabled: boolean) => {
    return baseApi.post<ApiResponse<void>>('/admin/proxy/toggle', { proxyId, isDisabled })
  },

  // 获取系统配置
  getSystemConfig: (key: string) => {
    return baseApi.post<ApiResponse<string>>('/admin/system/config/get', { key })
  },

  // 更新系统配置
  updateSystemConfig: (data: UpdateSystemConfigArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/system/config/update', data)
  },

  // 获取被禁用的邮箱提供商
  getBannedEmailProviders: () => {
    return baseApi.get<ApiResponse<string[]>>('/admin/system/bannedEmailProviders/get')
  },

  // 添加被禁用的邮箱提供商
  addBannedEmailProvider: (provider: string) => {
    return baseApi.post<ApiResponse<void>>('/admin/system/bannedEmailProviders/add', { provider })
  },

  // 删除被禁用的邮箱提供商
  removeBannedEmailProvider: (provider: string) => {
    return baseApi.post<ApiResponse<void>>('/admin/system/bannedEmailProviders/delete', { provider })
  }
}
