import baseApi from './config'
import type { ApiResponse } from './public';
import type { BaseUser } from '../../types/user'
export interface GetUsersData {
  users: BaseUser[];
  totalPages: number;
  totalUsers: number;
}

export interface GetUserGroupsData {
  groups: {
    name: string;
    friendlyName: string;
    maxProxies: number;
    baseTraffic: number;
    outBound: number;
    inBound: number;
  }[];
}

export interface FilterUsersParams {
  page: number;
  limit: number;
  group?: string;
  isRealname?: boolean;
  status?: number;
  keyword?: string;
}

export const AdminApi = {
  getUserGroups: () => {
    return baseApi.get<ApiResponse<GetUserGroupsData>>('/admin/user/groups')
  },
  filterUsers: (params: FilterUsersParams) => {
    return baseApi.post<ApiResponse<GetUsersData>>('/admin/user/filter', params)
  },
  banUser: (userId: number) => {
    return baseApi.post<ApiResponse<void>>('/admin/user/ban', { userId })
  },
  unbanUser: (userId: number) => {
    return baseApi.post<ApiResponse<void>>('/admin/user/unban', { userId })
  }
}
