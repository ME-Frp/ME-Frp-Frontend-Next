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

export interface Proxy {
    id: string
    name: string
    type: string
    node: string
    localAddr: string
    localPort: number
    remotePort: number
    domain?: string
    remoteAddr?: string
    status: 'online' | 'offline'
    usedTraffic: string
    createdAt: string
}