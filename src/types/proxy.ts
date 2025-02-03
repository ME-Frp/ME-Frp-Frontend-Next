export interface ProxyFormData {
    node: string | null
    localAddr: string | null
    localPort: number | null
    remotePort: number | null
    type: string | null
    domain: string | null
    name: string | null
}

export interface NodeOption {
    label: string
    value: string
}

export const proxyTypeOptions = [
    { label: 'TCP', value: 'tcp' },
    { label: 'UDP', value: 'udp' },
    { label: 'HTTP', value: 'http' },
    { label: 'HTTPS', value: 'https' }
] as const

export interface UpdateProxyArgs {
    proxyId: number;
    proxyName: string;
    localIp: string;
    localPort: number;
    remotePort: number;
    domain?: string;
    proxyType: string;
    nodeId: number;
}

export interface CreateProxyArgs {
    proxyName: string;
    localIp: string;
    localPort: number;
    remotePort: number;
    domain?: string;
    proxyType: string;
    nodeId: number;
    accessKey?: string;
    hostHeaderRewrite?: string;
    headerXFromWhere?: string;
    proxyProtocolVersion?: string;
    useEncryption?: boolean;
    useCompression?: boolean;
}

export interface Proxy {
    proxyId: number;
    proxyName: string;
    nodeId: number;
    localIp: string;
    localPort: number;
    remotePort: number;
    domain?: string;
    proxyType: string;
    /** 隧道是否在线 */
    isOnline: boolean;
    /** 隧道是否被封禁（管理员手动封禁） */
    isBanned: boolean;
    /** 隧道所属用户名 */
    username?: string;
    /** 隧道是否被禁用 */
    isDisabled?: boolean;
    location?: string;
    accessKey?: string;
    lastStartTime?: string;
    lastCloseTime?: string;
    hostHeaderRewrite?: string;
    headerXFromWhere?: string;
    useEncryption?: boolean;
    useCompression?: boolean;
    proxyProtocolVersion?: string;
}

