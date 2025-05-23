import type { UserInfo } from './authApi'
import type { Proxy } from './proxy'

export interface GetUsersData {
    users: UserInfo[];
    totalPages: number;
    totalUsers: number;
}

export interface FilterUsersArgs {
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
    region: string;
    bandwidth: string;
    hostname: string;
    description: string;
    token: string;
    servicePort: number;
    adminPort: number;
    adminPass: string;
    allowGroup: string;
    allowPort: string;
    allowType: string;
    isDisabled: boolean;
}

export interface AddNodeArgs {
    name: string;
    region: string;
    bandwidth: string;
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

export interface UpdateNodeArgs extends AddNodeArgs {
    nodeId: number;
}

export interface GetNodesArgs {
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

export interface UpdateUserArgs {
    userId: number;
    username?: string;
    email?: string;
    group?: string;
    status?: number;
    isRealname?: boolean;
    traffic?: number;
    outBound?: number;
    inBound?: number;
    maxProxies?: number;
    vipMonths?: number;
}

export interface FilterProxiesArgs {
    page: number;
    limit: number;
    nodeId?: number;
    username?: string;
    proxyType?: string;
    isOnline?: boolean;
    isBanned?: boolean;
    keyword?: string;
}

export interface GetProxiesData {
    proxies: Proxy[];
    totalPages: number;
    totalProxies: number;
}

export interface UpdateSystemConfigArgs {
    key: string;
    value: string;
}

export interface Product {
    productId: string
    system: string
    arch: string
    name: string
    desc: string
    path: string
    version: string
}

export interface Group {
    name: string
    friendlyName: string
    maxProxies: number
    baseTraffic: number
    outBound: number
    inBound: number
}

// 节点捐赠管理相关接口
export interface ApproveNodeDonateArgs {
    donateId: number
}

export interface RejectNodeDonateArgs {
    donateId: number
    reason: string
}

export interface ApproveNodeDeleteRequestArgs {
    requestId: number
}

export interface RejectNodeDeleteRequestArgs {
    requestId: number
    reason: string
}

// 节点编辑申请管理相关接口
export interface ApproveNodeEditRequestArgs {
    requestId: number
}

export interface RejectNodeEditRequestArgs {
    requestId: number
    reason: string
}