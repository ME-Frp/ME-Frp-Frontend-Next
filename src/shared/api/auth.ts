import baseApi from './config';
import type { ApiResponse } from './config';
import type { UserInfo, UserNode, Proxy, UpdateProxyArgs, CreateProxyArgs, GetUserGroupsData, UserNodeName, NodeUsage, IcpDomain, DownloadSource, GetNodeFreePortArgs, UserTrafficStats, RealnameInfo, Product } from '../../types';


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
    getFreeNodePort: (data: GetNodeFreePortArgs) => {
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
        return baseApi.post<ApiResponse<void>>('/auth/user/realname/legacy', data);
    },

    // 获取产品列表
    getProducts: () => {
        return baseApi.get<ApiResponse<Product[]>>('/auth/products')
    },

    // 获取下载源列表
    getDownloadSources: () => {
        return baseApi.get<ApiResponse<DownloadSource[]>>('/auth/downloadSources')
    },

    // 获取节点服务端口和令牌信息
    getNodeServerSecret: (data: { nodeId: number }) => {
        return baseApi.post<ApiResponse<{ serverPort: number; token: string }>>('/auth/node/secret', data);
    },

    // 生成隧道配置文件
    generateProxyConfig: (data: { proxyId: number, format: 'toml' | 'ini' | 'json' | 'yml' }) => {
        return baseApi.post<ApiResponse<{ config: string, type: string }>>('/auth/proxy/config', data);
    },

    // 获取用户流量统计
    getUserTrafficStats: () => {
        return baseApi.get<ApiResponse<UserTrafficStats>>('/auth/user/trafficStats');
    },
};

export type { RealnameInfo };
export type { UserTrafficStats };
export default AuthApi;