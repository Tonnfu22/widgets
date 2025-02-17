import 'assets/fonts.scss'
import './external'

import { mix, rgba, transparentize } from 'polished'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { DefaultTheme, ThemeProvider as StyledProvider } from 'styled-components/macro'

import type { Colors, Theme } from './theme'

export * from './dynamic'
export * from './layer'
export type { Color, Colors, Theme } from './theme'
export * as ThemedText from './type'

const white = 'hsl(0, 0%, 100%)'
const black = 'hsl(0, 0%, 0%)'

const brandLight = 'hsl(328, 97%, 53%)'
const brandDark = 'hsl(221, 96%, 64%)'
export const brand = brandLight

const stateColors = {
  active: 'hsl(221, 96%, 64%)',
  success: 'hsl(145, 63.4%, 41.8%)',
  warningSoft: 'hsla(44, 86%, 51%, 0.24)',
}

export const lightTheme: Colors = {
  // surface
  accent: brandLight,
  accentSoft: rgba(brandLight, 0.12),
  container: 'hsl(0, 0%, 100%)',
  module: 'hsl(231, 54%, 97%)',
  interactive: 'hsl(227, 70%, 95%)',
  outline: 'hsla(225, 18%, 44%, 0.24)',
  dialog: white,

  // text
  onAccent: white,
  primary: 'hsl(224, 37%, 8%)',
  secondary: 'hsl(227, 18%, 55%)',
  hint: 'hsl(226, 24%, 67%)',
  onInteractive: black,

  networkDefaultShadow: 'hsla(328, 97%, 53%, 0.12)',

  // state
  ...stateColors,
  warning: 'hsla(41, 100%, 35%, 1)',
  error: 'hsla(356, 95%, 57%, 1)',

  currentColor: 'currentColor',
}

export const darkTheme: Colors = {
  // surface
  accent: brandDark,
  accentSoft: rgba(brandDark, 0.12),
  container: 'hsla(224, 37%, 8%, 1)',
  module: 'hsl(222, 37%, 12%)',
  interactive: 'hsla(223, 28%, 22%, 1)',
  outline: 'hsl(224, 33%, 16%)',
  dialog: black,

  // text
  onAccent: white,
  primary: white,
  secondary: 'hsl(227, 21%, 67%)',
  hint: 'hsl(225, 10%, 47.1%)',
  onInteractive: white,

  networkDefaultShadow: 'hsla(221, 96%, 64%, 0.16)',

  // state
  ...stateColors,
  warning: 'hsl(44, 86%, 51%)',
  error: 'hsla(5, 97%, 71%, 1)',

  currentColor: 'currentColor',
}

export const defaultTheme = {
  borderRadius: 1,
  fontFamily: {
    font: '"Inter", sans-serif',
    variable: '"InterVariable", sans-serif',
  },
  fontFamilyCode: 'IBM Plex Mono',
  tokenColorExtraction: false,
  ...lightTheme,
}

export function useSystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const [systemTheme, setSystemTheme] = useState(prefersDark.matches ? darkTheme : lightTheme)
  prefersDark.addEventListener('change', (e) => {
    setSystemTheme(e.matches ? darkTheme : lightTheme)
  })
  return systemTheme
}

const ThemeContext = createContext<DefaultTheme>(toDefaultTheme(defaultTheme))

export interface ThemeProps {
  theme?: Theme
}

export function Provider({ theme, children }: PropsWithChildren<ThemeProps>) {
  const contextTheme = useContext(ThemeContext)
  const value = useMemo(() => {
    return toDefaultTheme({
      ...contextTheme,
      ...theme,
    } as Required<Theme>)
  }, [contextTheme, theme])
  return (
    <ThemeContext.Provider value={value}>
      <StyledProvider theme={value}>{children}</StyledProvider>
    </ThemeContext.Provider>
  )
}

function toDefaultTheme(theme: Required<Theme>): DefaultTheme {
  return {
    ...theme,
    borderRadius: clamp(
      Number.isFinite(theme.borderRadius) ? (theme.borderRadius as number) : theme.borderRadius ? 1 : 0
    ),
    onHover: (color: string) =>
      color === theme.primary ? transparentize(0.4, theme.primary) : mix(0.16, theme.primary, color),
  }

  function clamp(value: number) {
    return Math.min(Math.max(value, 0), 1)
  }
}
