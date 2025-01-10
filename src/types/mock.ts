import type { UserInfo, Notice, Sponsor, ProxyFormData, NodeOption, Proxy } from '.'


export const mockNotices: Notice[] = [
  {
    id: 1,
    title: '通知',
    time: '2024-03-20',
    content: '...'
  },
  {
    id: 2,
    title: '通知',
    time: '2024-03-18',
    content: '...'
  },
  {
    id: 3,
    title: '通知',
    time: '2024-03-15',
    content: '...'
  },
  {
    id: 4,
    title: '通知',
    time: '2024-03-10',
    content: '...'
  }
]

export const mockSponsors: Sponsor[] = [
  {
    name: 'Nothing_734',
    email: '3217962725@qq.com',
    amount: '15元现金',
    message: '未填写'
  },
  {
    name: 'yeE_E1XD',
    email: '649117540@qq.com',
    amount: '16.6元现金加美国3服务器',
    message: '加油啊啊啊啊啊啊'
  },
  {
    name: 'cui_pig',
    email: 'zqy801224@outlook.com',
    amount: '15元现金',
    message: '出个教程行不（站长补：已经有了哦，就在首页！）'
  },
  {
    name: 'jqyh',
    email: '528368293@qq.com',
    amount: '20元现金',
    message: '支持一下，很流畅'
  },
  {
    name: 'angetadi',
    email: '1270177892@qq.com',
    amount: '20元现金',
    message: '希望能坚持下去，能留一个联络用邮箱再网站上就更好了（站长补：im@aehxy.com/admin@mcserverx.com）'
  },
  {
    name: 'windchasingguys',
    email: 'windchasingguys@163.com',
    amount: '20元现金',
    message: '未填写'
  },
  {
    name: 'wstar',
    email: 'fengqixin2150@163.com',
    amount: '11.11元现金',
    message: '黑暗中的一团火啊，十分感谢啊'
  },
  {
    name: '微信用户 *辰',
    email: '2313403184@qq.com',
    amount: '0.88+0.66元现金',
    message: '用了好久，蛮好用的'
  },
  {
    name: '微信用户 K*a',
    email: '未填写',
    amount: '6.66元现金',
    message: '加油吧，用着还可以~MYYS'
  },
  {
    name: 'GhostCN_Z',
    email: '未填写',
    amount: '15元现金',
    message: '加油加油'
  },
  {
    name: '微信用户 *笑',
    email: '455167595@qq.com',
    amount: '1.8元现金',
    message: '未填写'
  },
  {
    name: 'lcy123456',
    email: '3108380633@qq.com',
    amount: '6.60元现金',
    message: '加油'
  },
  {
    name: '微信用户 *气',
    email: '未填写',
    amount: '6.66元现金',
    message: '未填写'
  },
  {
    name: '微信用户 *风',
    email: '未填写',
    amount: '15元现金',
    message: '未填写'
  },
  {
    name: '微信用户 *岬',
    email: '未填写',
    amount: '5元现金',
    message: '未填写'
  },
  {
    name: '微信用户 *笑',
    email: '未填写',
    amount: '10元现金',
    message: '一点心意'
  },
  {
    name: '微信用户 *莀',
    email: '未填写',
    amount: '1元现金',
    message: '30mbps的带宽！天天送流量太良心！大爱！加油'
  },
  {
    name: '微信用户 *梦',
    email: '未填写',
    amount: '2元现金',
    message: '未填写'
  },
  {
    name: 'Tansor',
    email: '2315770989@qq.com',
    amount: '6.66元现金',
    message: '好得很哇'
  },
  {
    name: '微信用户 U*r',
    email: '未填写',
    amount: '3元现金',
    message: '未填写'
  },
  {
    name: '落雪无痕LxHTT',
    email: '3395314362@qq.com',
    amount: '3元现金',
    message: 'ME Frp 越做越强！'
  },
  {
    name: '微信用户 S*s',
    email: 'ww2470743734@gmail.com',
    amount: '3元现金',
    message: '未填写'
  },
  {
    name: '微信用户 l*k',
    email: '未填写',
    amount: '3元现金',
    message: '用爱发电，属实不易，加油[加油]'
  },
  {
    name: '微信用户 *易',
    email: '未填写',
    amount: '3元现金',
    message: '未填写'
  },
  {
    name: '微信用户 *叶',
    email: '未填写',
    amount: '1元现金',
    message: '加油！'
  },
  {
    name: '微信用户 *艺',
    email: 'love1727915@126.com',
    amount: '1元现金',
    message: '未填写'
  }
]

export const mockNodeOptions: NodeOption[] = [
  { label: '香港节点 1', value: 'hk1' },
  { label: '美国节点 1', value: 'us1' },
  { label: '日本节点 1', value: 'jp1' },
  { label: '新加坡节点 1', value: 'sg1' }
]

export const mockProxyFormData: ProxyFormData = {
  node: null,
  localAddr: null,
  localPort: null,
  remotePort: null,
  type: null,
  domain: null,
  name: null
}

export const mockProxies: Proxy[] = [
  {
    id: '1',
    name: 'MC 服务器',
    type: 'tcp',
    node: 'hk1',
    localAddr: '127.0.0.1',
    localPort: 25565,
    remotePort: 12345,
    remoteAddr: 'hk1.example.com:12345',
    status: 'online',
    usedTraffic: '1.5 GB',
    createdAt: '2024-03-20 12:00:00'
  },
  {
    id: '2',
    name: '个人博客',
    type: 'http',
    node: 'us1',
    localAddr: '127.0.0.1',
    localPort: 3000,
    remotePort: 80,
    domain: 'blog.example.com',
    remoteAddr: 'us1.example.com',
    status: 'offline',
    usedTraffic: '500 MB',
    createdAt: '2024-03-19 15:30:00'
  },
  {
    id: '3',
    name: '远程桌面',
    type: 'tcp',
    node: 'jp1',
    localAddr: '127.0.0.1',
    localPort: 3389,
    remotePort: 23389,
    remoteAddr: 'jp1.example.com:23389',
    status: 'online',
    usedTraffic: '10.2 GB',
    createdAt: '2024-03-18 09:15:00'
  },
  {
    id: '4',
    name: '网站测试环境',
    type: 'https',
    node: 'sg1',
    localAddr: '127.0.0.1',
    localPort: 8080,
    remotePort: 443,
    domain: 'test.example.com',
    remoteAddr: 'sg1.example.com',
    status: 'online',
    usedTraffic: '2.8 GB',
    createdAt: '2024-03-17 16:45:00'
  },
  {
    id: '5',
    name: '游戏服务器',
    type: 'udp',
    node: 'us1',
    localAddr: '127.0.0.1',
    localPort: 27015,
    remotePort: 27015,
    remoteAddr: 'us1.example.com:27015',
    status: 'offline',
    usedTraffic: '15.7 GB',
    createdAt: '2024-03-16 20:30:00'
  }
]