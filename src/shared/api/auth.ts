import baseApi from './config';
import type { ApiResponse } from './config';
import type { UserInfo, UserNode, Proxy, UpdateProxyArgs, CreateProxyArgs, GetUserGroupsData, UserNodeName, NodeUsage, IcpDomain } from '../../types';

// 在 UserInfo 类型中添加实名信息接口
interface RealnameInfo {
  realname: string;
  idCard: string;
  time: number;
  status: number;
}

export const AuthApi = {
    // 获取公告
    getNotice: () => {
        return baseApi.get<ApiResponse<string>>('/auth/notice');
    },

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

    getNodeStatus: () => {
        return baseApi.get<ApiResponse<NodeUsage[]>>('/auth/node/status');
    },

    // 获取空闲节点端口
    getFreeNodePort: (data: { nodeId: number }) => {
        return baseApi.post<ApiResponse<number>>('/auth/node/freePort', data);
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

    // 禁用/启用隧道
    toggleProxy: (proxyId: number, isDisabled: boolean) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/toggle', { proxyId, isDisabled });
    },

    // 刷新隧道状态
    refreshProxyStatus: (proxyId: number) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/refresh', { proxyId });
    },

    // 强制下线隧道
    kickProxy: (proxyId: number) => {
        return baseApi.post<ApiResponse<void>>('/auth/proxy/kick', { proxyId });
    },

    // 获取ICP备案域名列表
    getIcpDomains: () => {
        return baseApi.get<ApiResponse<IcpDomain[]>>('/auth/user/icpDomain/list');
    },

    // 添加ICP备案域名
    addIcpDomain: (data: { domain: string }) => {
        return baseApi.post<ApiResponse<void>>('/auth/user/icpDomain/add', data);
    },

    // 删除ICP备案域名
    deleteIcpDomain: (data: { domain: string }) => {
        return baseApi.post<ApiResponse<void>>('/auth/user/icpDomain/delete', data);
    },

    // 获取ICP备案域名所有者
    getIcpDomainOwner: (data: { domain: string }) => {
        return baseApi.post<ApiResponse<void>>('/auth/user/icpDomain/owner', data);
    },

    // 获取实名认证信息
    getRealnameInfo: () => {
        return baseApi.get<ApiResponse<number>>('/auth/user/info/realname');
    },

    // 提交实名认证
    submitRealname: (data: { realname: string; idCard: string }) => {
        return baseApi.post<ApiResponse<void>>('/auth/user/realname/verify', data);
    },
};

export type { RealnameInfo };
export default AuthApi;