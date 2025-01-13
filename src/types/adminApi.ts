import type { UserInfo } from './authApi'

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

export interface AddNodeArgs {
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
}

export interface Proxy {
    proxyId: number;
    proxyName: string;
    username: string;
    nodeId: number;
    localIp: string;
    localPort: number;
    remotePort: number;
    domain?: string;
    proxyType: string;
    isOnline: boolean;
    isBanned: boolean;
    location: string;
    accessKey: string;
    hostHeaderRewrite: string;
    headerXFromWhere: string;
    useEncryption: boolean;
    useCompression: boolean;
    proxyProtocolVersion: string;
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