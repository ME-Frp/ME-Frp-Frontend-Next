export interface UserInfo {
  userId: number
  username: string
  isRealname: boolean
  group: string
  friendlyGroup: string
  usedProxies: number
  maxProxies: number
  regTime: number
  traffic: number
  outBound: number
  inBound: number
  email: string
  status: number
  todaySigned: boolean
}

export interface UserNode {
  nodeId: number;
  name: string;
  hostname: string;
  description: string;
  allowGroup: string;
  allowPort: string;
  allowType: string;
  isOnline: boolean;
  isDisabled: boolean;
}

export interface UserNodeName {
  nodeId: number;
  name: string;
  hostname: string;
}

export interface GetUserGroupsData {
  groups: UserGroup[];
}

export interface UserGroup {
  name: string;
  friendlyName: string;
  maxProxies: number;
  baseTraffic: number;
  outBound: number;
  inBound: number;
}

export interface NodeUsage {
  nodeId: number;
  name: string;
  totalTrafficIn: number;
  totalTrafficOut: number;
  onlineClient: number;
  onlineProxy: number;
  isOnline: boolean;
}

export interface IcpDomain {
  domain: string;
  natureName: string;
  username: string;
  icpId: string;
  unitName: string;
}

export interface DownloadSource {
  id: string
  path: string
  name: string
}

export interface GetNodeFreePortArgs {
  nodeId: number
  protocol: 'tcp' | 'udp'
}

export interface CreateProxyArgs {
  nodeId: number
  proxyName: string
  localIp: string
  localPort: number
  remotePort: number
  domain?: string
  proxyType: string
  accessKey?: string
  hostHeaderRewrite?: string
  headerXFromWhere?: string
  proxyProtocolVersion?: string
  useEncryption: boolean
  useCompression: boolean
}

export interface UpdateProxyArgs extends CreateProxyArgs {
  proxyId: number
}

// 节点捐赠相关接口
export interface NodeDonate {
  donateId: number
  username: string
  nodeName: string
  hostname: string
  description: string
  servicePort: number
  adminPort: number
  adminPass: string
  allowGroup: string
  allowPort: string
  allowType: string
  status: number // 0: 待审核, 1: 已通过, 2: 已拒绝
  rejectReason: string
  applyTime: number
  reviewTime: number
  nodeId?: number // 关联的实际节点ID
}

export interface ApplyNodeDonateArgs {
  nodeName: string
  hostname: string
  description: string
  servicePort: number
  adminPort: number
  adminPass: string
  allowGroup: string
  allowPort: string
  allowType: string
}

export interface NodeDeleteRequest {
  requestId: number
  nodeId: number
  username: string
  reason: string
  status: number // 0: 待审核, 1: 已通过, 2: 已拒绝
  rejectReason: string
  applyTime: number
  reviewTime: number
}

export interface ApplyNodeDeleteArgs {
  nodeId: number
  reason: string
}