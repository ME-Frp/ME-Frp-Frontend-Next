import baseApi from './config'
import type { ApiResponse } from './config';
import type { UserInfo } from '../../types/user'
import type { GetUsersData, FilterUsersArgs, GetUserGroupsData, UpdateUserArgs, GetNodesData, AddNodeArgs, GetNodesArgs, UpdateNodeArgs } from '../../types/adminApi'

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

  getUserGroups: () => {
    return baseApi.get<ApiResponse<GetUserGroupsData>>('/admin/user/groups')
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
  }
}
