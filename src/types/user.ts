export interface BaseUser {
  userId: number
  username: string
  email: string
  group: string
  friendlyGroup: string
  regTime: number
  status: number
  isRealname: boolean
}

export interface UserInfo {
  userId: number
  username: string
  isRealname: boolean
  group: string
  friendlyGroup: string
  usedProxies: number
  maxProxies: number
  regTime: string
  traffic: string
  outBound: number
  inBound: number
  email: string
}

export interface Sponsor {
  name: string
  email: string
  amount: string
  message: string
}

export interface Notice {
  id: number
  title: string
  time: string
  content: string
}