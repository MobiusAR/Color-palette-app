import { ColorData, ColorPaletteData } from '../types'

// Convert hex to HSL
export const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

// Convert HSL to hex
export const hslToHex = (h: number, s: number, l: number): string => {
  h = h % 360
  s = Math.max(0, Math.min(100, s))
  l = Math.max(0, Math.min(100, l))

  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l / 100 - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

  return `#${rHex}${gHex}${bHex}`
}

// Convert hex to RGB
export const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

// Convert HSL to RGB string
export const hslToRgb = (h: number, s: number, l: number): string => {
  h = h % 360
  s = Math.max(0, Math.min(100, s))
  l = Math.max(0, Math.min(100, l))

  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l / 100 - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  const rFinal = Math.round((r + m) * 255)
  const gFinal = Math.round((g + m) * 255)
  const bFinal = Math.round((b + m) * 255)

  return `rgb(${rFinal}, ${gFinal}, ${bFinal})`
}

// Convert HSL to HSL string
export const hslToString = (h: number, s: number, l: number): string => {
  h = Math.round(h)
  s = Math.round(s)
  l = Math.round(l)
  return `hsl(${h}, ${s}%, ${l}%)`
}

// Calculate contrast ratio for accessibility
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hex.match(/[A-Za-z0-9]{2}/g)?.map(v => parseInt(v, 16) / 255) || [0, 0, 0]
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

// Check if contrast meets accessibility standards
export const isAccessible = (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(color1, color2)
  const minRatio = level === 'AA' ? 4.5 : 7
  return ratio >= minRatio
}

// Generate accessible background color
export const generateAccessibleBackground = (primaryHex: string): string => {
  const [h, s, l] = hexToHsl(primaryHex)
  
  // Create a very light, neutral background that provides good contrast
  if (l < 50) {
    // If primary is dark, use very light background
    return hslToHex(h, Math.max(0, s - 60), 95)
  } else {
    // If primary is light, use very dark background
    return hslToHex(h, Math.max(0, s - 60), 15)
  }
}

// Generate better secondary color with proper contrast
export const generateBetterSecondary = (primaryHex: string): string => {
  const [h, s, l] = hexToHsl(primaryHex)
  
  // Create a secondary color that's lighter and more desaturated
  // This provides visual separation while maintaining harmony
  const secondaryL = Math.min(95, l + 20)
  const secondaryS = Math.max(0, s - 30)
  
  return hslToHex(h, secondaryS, secondaryL)
}

// Generate accessible text colors
export const generateTextColors = (backgroundHex: string): { primary: string, secondary: string } => {
  const [, , l] = hexToHsl(backgroundHex)
  
  if (l > 50) {
    // Light background - use dark text
    return {
      primary: '#000000',
      secondary: '#333333'
    }
  } else {
    // Dark background - use light text
    return {
      primary: '#FFFFFF',
      secondary: '#E0E0E0'
    }
  }
}

// Create color data object with accessibility info
const createColorData = (hex: string, name: string, usage: string): ColorData => {
  const [h, s, l] = hexToHsl(hex)
  return {
    hex,
    rgb: hexToRgb(hex),
    hsl: hslToString(h, s, l),
    name,
    usage
  }
}

// Generate improved UI/UX color palette
export const generateColorPalette = (hexColor: string): ColorPaletteData => {
  const [h, s, l] = hexToHsl(hexColor)
  
  // Generate better, more accessible colors
  const primary = hexColor
  const secondary = generateBetterSecondary(hexColor)
  const background = generateAccessibleBackground(hexColor)
  const textColors = generateTextColors(background)
  
  // Create a complementary accent that stands out
  const accent = hslToHex((h + 180) % 360, Math.min(100, s + 10), Math.max(30, l - 10))
  
  // Create analogous colors with better contrast
  const analogous1 = hslToHex((h + 30) % 360, Math.max(0, s - 20), Math.max(40, l - 10))
  const analogous2 = hslToHex((h - 30 + 360) % 360, Math.max(0, s - 20), Math.max(40, l - 10))
  
  // Create triadic colors with proper contrast
  const triadic1 = hslToHex((h + 120) % 360, Math.max(0, s - 15), Math.max(35, l - 15))
  const triadic2 = hslToHex((h + 240) % 360, Math.max(0, s - 15), Math.max(35, l - 15))
  
  // Create monochromatic variations with better contrast
  const monochromatic1 = hslToHex(h, Math.max(0, s - 40), Math.max(60, l + 20))
  const monochromatic2 = hslToHex(h, Math.max(0, s - 30), Math.max(20, l - 20))
  
  return {
    primary: createColorData(primary, 'Primary', 'Main actions, headers, primary buttons'),
    secondary: createColorData(secondary, 'Secondary', 'Secondary buttons, less important links'),
    background: createColorData(background, 'Background', 'Main background, provides contrast'),
    accent: createColorData(accent, 'Accent', 'CTAs, important actions, highlights'),
    analogous1: createColorData(analogous1, 'Analogous 1', 'Harmonious neighbor color'),
    analogous2: createColorData(analogous2, 'Analogous 2', 'Harmonious neighbor color'),
    triadic1: createColorData(triadic1, 'Triadic 1', 'Balanced triad color'),
    triadic2: createColorData(triadic2, 'Triadic 2', 'Balanced triad color'),
    monochromatic1: createColorData(monochromatic1, 'Light Variant', 'Lighter variation for backgrounds'),
    monochromatic2: createColorData(monochromatic2, 'Dark Variant', 'Darker variation for emphasis'),
    textPrimary: createColorData(textColors.primary, 'Text Primary', 'Main text color'),
    textSecondary: createColorData(textColors.secondary, 'Text Secondary', 'Secondary text color')
  }
}
