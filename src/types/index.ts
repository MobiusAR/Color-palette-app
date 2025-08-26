export interface ColorData {
  hex: string
  rgb: string
  hsl: string
  name: string
  usage: string
}

export interface ColorPaletteData {
  primary: ColorData
  secondary: ColorData
  background: ColorData
  accent: ColorData
  analogous1: ColorData
  analogous2: ColorData
  triadic1: ColorData
  triadic2: ColorData
  monochromatic1: ColorData
  monochromatic2: ColorData
  textPrimary: ColorData
  textSecondary: ColorData
}
