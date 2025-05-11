import type { GlobalThemeOverrides } from 'naive-ui'

// 主题颜色配置
const defaultColors = {
  primaryColor: '#2080f0',
  primaryColorHover: '#4098fc',
  primaryColorPressed: '#1060c9',
  primaryColorSuppl: '#90caf9'
}

const sponsorColors = {
  primaryColor: '#00BCD4',
  primaryColorHover: '#26C6DA',
  primaryColorPressed: '#0097A7',
  primaryColorSuppl: '#B2EBF2'
}

const vipColors = {
  primaryColor: '#D4AF37',
  primaryColorHover: '#E5C158',
  primaryColorPressed: '#B8860B',
  primaryColorSuppl: '#F5E6C3'
}

const adminColors = {
  primaryColor: '#1060c9',
  primaryColorHover: '#2080f0',
  primaryColorPressed: '#0047a3',
  primaryColorSuppl: '#70b0f9'
}

const memorialColors = {
  primaryColor: '#666666',
  primaryColorHover: '#808080',
  primaryColorPressed: '#4d4d4d',
  primaryColorSuppl: '#808080'
}

// 主题配置
const themeConfigs = {
  default: {
    common: defaultColors
  },
  sponsor: {
    common: sponsorColors
  },
  vip: {
    common: vipColors
  },
  admin: {
    common: adminColors
  },
  memorial: {
    common: memorialColors
  }
} as const

// 特殊日期配置
const specialDates = {
  memorial: [
    { month: 4, day: 4 },
    { month: 12, day: 13 },
    { month: 7, day: 7 },
    { month: 9, day: 18 },
  ],
  holiday: [
    { month: 10, day: 1 },
    { month: 7, day: 1 },
    { month: 8, day: 1 },
  ]
}

// 检查特殊日期
function checkSpecialDate(): string | null {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  // 检查纪念日
  for (const date of specialDates.memorial) {
    if (date.month === month && date.day === day) {
      return 'memorial'
    }
  }

  // 检查节日
  for (const date of specialDates.holiday) {
    if (date.month === month && date.day === day) {
      return 'admin' // 使用红色主题
    }
  }

  return null
}

// 获取主题配置
export function getThemeOverrides(): GlobalThemeOverrides {
  // 首先检查特殊日期
  const specialTheme = checkSpecialDate()
  if (specialTheme) {
    return themeConfigs[specialTheme] as GlobalThemeOverrides
  }

  // 然后检查用户组
  const group = localStorage.getItem('group')
  if (group && group in themeConfigs) {
    return themeConfigs[group as keyof typeof themeConfigs] as GlobalThemeOverrides
  }

  // 默认返回默认主题
  return themeConfigs.default as GlobalThemeOverrides
}

export const getExemptedTheme = () => {
  return themeConfigs.default as GlobalThemeOverrides
}

export const defaultSwc = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const currentTheme = getThemeOverrides()
  return {
    background: checked ? currentTheme.common?.primaryColor : undefined,
    boxShadow: focused ? `0 0 0 2px ${currentTheme.common?.primaryColorSuppl}` : undefined
  }
}

export const exemptedSwc = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const currentTheme = themeConfigs.default
  return {
    background: checked ? currentTheme.common?.primaryColor : undefined,
    boxShadow: focused ? `0 0 0 2px ${currentTheme.common?.primaryColorSuppl}` : undefined
  }
}