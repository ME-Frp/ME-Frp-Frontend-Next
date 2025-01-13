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

export interface UserNode {
    nodeId: number;
    name: string;
    hostname: string;
    allowedProtocols: string[];
    portRange: {
        min: number;
        max: number;
    };
}

