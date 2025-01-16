import baseApi from './config'
import type { ApiResponse } from './config';
import type { UserInfo } from '../../types/authApi'
import type { GetUsersData, FilterUsersArgs, GetUserGroupsData, UpdateUserArgs, GetNodesData, AddNodeArgs, GetNodesArgs, UpdateNodeArgs, FilterProxiesArgs, GetProxiesData, UpdateProxyArgs } from '../../types'

export const AdminApi = {
  // 用户相关
  filterUsers: (params: FilterUsersArgs) => {
    return baseApi.post<ApiResponse<GetUsersData>>('/admin/user/filter', params)
  },

  banUser: (userId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/user/ban`, { userId })
  },

  unbanUser: (userId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/user/unban`, { userId })
  },

  getUser: (userId: number) => {
    return baseApi.post<ApiResponse<UserInfo>>(`/admin/user/get`, { userId })
  },

  updateUser: (params: UpdateUserArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/user/update', params)
  },

  // 节点相关
  filterNodes: (params: GetNodesArgs) => {
    return baseApi.post<ApiResponse<GetNodesData>>('/admin/node/filter', params)
  },

  addNode: (config: AddNodeArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/node/add', config)
  },

  updateNode: (config: UpdateNodeArgs) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/update`, config)
  },

  deleteNode: (nodeId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/delete`, { nodeId })
  },

  toggleNode: (nodeId: number, isDisabled: boolean) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/toggle`, { nodeId, isDisabled })
  },

  // 隧道相关
  filterProxies: (params: FilterProxiesArgs) => {
    return baseApi.post<ApiResponse<GetProxiesData>>('/admin/proxy/filter', params)
  },

  banProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/ban`, { proxyId })
  },

  unbanProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/unban`, { proxyId })
  },

  deleteProxy: (proxyId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/proxy/delete`, { proxyId })
  },

  updateProxy: (params: UpdateProxyArgs) => {
    return baseApi.post<ApiResponse<void>>('/admin/proxy/update', params)
  }
}
