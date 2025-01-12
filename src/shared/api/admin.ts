import baseApi from './config'
import type { ApiResponse } from './config';
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


export interface Node {
  nodeId: number;
  name: string;
  hostname: string;
  description: string;
  token: string;
  servicePort: number;
  adminPort: number;
  adminPass: string;
  allowGroup: string;
  allowPort: string;
  allowType: string;
}

export interface AddNodeConfig {
  name: string;
  hostname: string;
  description: string;
  token: string;
  servicePort: number;
  adminPort: number;
  adminPass: string;
  allowGroup: string;
  allowPort: string;
  allowType: string;
}

export interface UpdateNodeConfig extends AddNodeConfig {
  nodeId: number;
}

export interface GetNodesParams {
  page: number;
  limit: number;
  isOnline?: boolean;
  isDisabled?: boolean;
  keyword?: string;
}

export interface GetNodesData {
  nodes: Node[];
  totalPages: number;
  totalNodes: number;
}

export const AdminApi = {
  // 用户相关
  filterUsers: (params: FilterUsersParams) => {
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

  // 节点相关
  filterNodes: (params: GetNodesParams) => {
    return baseApi.post<ApiResponse<GetNodesData>>('/admin/node/filter', params)
  },

  addNode: (config: AddNodeConfig) => {
    return baseApi.post<ApiResponse<void>>('/admin/node/add', config)
  },

  updateNode: (config: UpdateNodeConfig) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/update`, config)
  },

  deleteNode: (nodeId: number) => {
    return baseApi.post<ApiResponse<void>>(`/admin/node/delete`, { nodeId })
  }
}
