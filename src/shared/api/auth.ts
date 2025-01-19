import baseApi from './config';
import type { ApiResponse } from './config';
import type { UserInfo, UserNode, Proxy, UpdateProxyArgs, CreateProxyArgs, GetUserGroupsData, UserNodeName } from '../../types';


export const AuthApi = {
    // 获取用户信息
    getUserInfo: () => {
        return baseApi.get<ApiResponse<UserInfo>>('/auth/user/info');
    },

    // 执行签到
    sign: () => {
        return baseApi.get<ApiResponse<{ extraTraffic: number }>>('/auth/user/sign');
    },

    // 重置访问密钥
    tokenReset: () => {
        return baseApi.get<ApiResponse<{ newToken: string }>>('/auth/user/tokenReset');
    },

    // 重置密码
    passwordReset: (data: { oldPassword: string; newPassword: string }) => {
        return baseApi.post<ApiResponse<void>>('/auth/user/passwordReset', data);
    },

    // 获取节点列表
    getNodes: () => {
        return baseApi.get<ApiResponse<UserNode[]>>('/auth/node/list');
    },

    // 获取节点名称列表
    getNodeNames: () => {
        return baseApi.get<ApiResponse<UserNodeName[]>>('/auth/node/nameList');
    },

    // 获取用户隧道列表
    getUserProxies: () => {
        return baseApi.get<ApiResponse<Proxy[]>>('/auth/proxy/list');
    },

    // 获取用户组列表
    getUserGroups: () => {
        return baseApi.get<ApiResponse<GetUserGroupsData>>('/auth/user/groups')
    },

    // 创建隧道
    createProxy: (data: CreateProxyArgs) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/create', data);
    },

    // 删除隧道
    deleteProxy: (proxyId: number) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/delete', { proxyId });
    },

    // 更新隧道
    updateProxy: (data: UpdateProxyArgs) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/update', data);
    },

    // 刷新隧道状态
    refreshProxyStatus: (proxyId: number) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/refresh', { proxyId });
    },

    // 强制下线隧道
    kickProxy: (proxyId: number) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/kick', { proxyId });
    },
};

export default AuthApi;