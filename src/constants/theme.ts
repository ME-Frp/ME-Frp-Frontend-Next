export const themeColors = {
  primary: '#2196F3',
  primaryHover: '#42A5F5',
  primaryPressed: '#1976D2',
  primarySuppl: '#90CAF9',
} as const

export const themeOverrides = {
  common: {
    primaryColor: themeColors.primary,
    primaryColorHover: themeColors.primaryHover,
    primaryColorPressed: themeColors.primaryPressed,
    primaryColorSuppl: themeColors.primarySuppl,
  },
  Button: {
    textColorPrimary: '#FFFFFF',
    textColorHoverPrimary: '#FFFFFF',
    textColorPressedPrimary: '#FFFFFF',
    textColorFocusPrimary: '#FFFFFF',
  },
  Menu: {
    itemTextColorActive: themeColors.primary,
    itemIconColorActive: themeColors.primary,
    itemTextColorActiveHover: themeColors.primaryHover,
    itemIconColorActiveHover: themeColors.primaryHover,
  }
} as const

export const switchButtonRailStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  return {
    background: checked ? themeOverrides.common?.primaryColor : undefined,
    boxShadow: focused ? `0 0 0 2px ${themeOverrides.common?.primaryColorSuppl}` : undefined
  }
}