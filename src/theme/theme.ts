export interface Colors {
  // surface
  accent: string
  accentSoft: string
  container: string
  module: string
  interactive: string
  outline: string
  dialog: string

  // text
  primary: string
  onAccent: string
  secondary: string
  hint: string
  onInteractive: string

  // state
  active: string
  success: string
  warning: string
  warningSoft: string
  error: string

  networkDefaultShadow: string

  currentColor: 'currentColor'
}

export type Color = keyof Colors

export interface Attributes {
  borderRadius: boolean | number
  fontFamily:
    | string
    | {
        font: string
        variable: string
      }
  fontFamilyCode: string
  tokenColorExtraction: boolean
}

export interface Theme extends Partial<Attributes>, Partial<Colors> {}
