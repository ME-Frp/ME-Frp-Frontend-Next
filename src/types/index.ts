export * from './authApi'
export * from './proxy'
export * from './publicApi'
export * from './adminApi'

export interface GetNodeFreePortArgs {
  nodeId: number
  protocol: 'tcp' | 'udp'
}

// 添加Window接口，扩展全局window对象
export interface Window extends globalThis.Window {
  $loadingBar?: {
    start: () => void
    finish: () => void
    error: () => void
  }
  $message?: any
  $dialog?: any
  $notification?: any
  $naive?: any
  __tableParsingTested?: boolean
  __manualTableTested?: boolean
}