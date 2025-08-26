import React, { useState } from 'react'
import ColorInput from './components/ColorInput'
import ColorPalette from './components/ColorPalette'
import { ColorPaletteData } from './types'
import { generateColorPalette } from './utils/colorUtils'
import './App.css'

function App() {
  const [palette, setPalette] = useState<ColorPaletteData | null>(null)
  const [showPalette, setShowPalette] = useState(false)
  const [primaryColor, setPrimaryColor] = useState('#D2691E')

  const handleGeneratePalette = (hexColor: string) => {
    const newPalette = generateColorPalette(hexColor)
    setPalette(newPalette)
    setPrimaryColor(hexColor)
    setShowPalette(true)
  }

  // Generate dynamic CSS variables based on primary color
  const generateDynamicTheme = (hexColor: string) => {
    const [h, s, l] = hexToHsl(hexColor)
    
    // Create a harmonious color scheme
    const primaryDark = hslToHex(h, Math.min(100, s + 20), Math.max(0, l - 30))
    const primaryLight = hslToHex(h, Math.max(0, s - 20), Math.min(100, l + 30))
    const secondary = hslToHex((h + 30) % 360, Math.max(0, s - 30), Math.max(40, l - 10))
    const accent = hslToHex((h + 180) % 360, Math.min(100, s + 10), Math.max(30, l - 10))
    const background = hslToHex(h, Math.max(0, s - 60), 95)
    const surface = hslToHex(h, Math.max(0, s - 40), 90)
    const textPrimary = l > 50 ? '#000000' : '#ffffff'
    const textSecondary = l > 50 ? '#333333' : '#e0e0e0'
    
    return {
      '--primary-color': hexColor,
      '--primary-dark': primaryDark,
      '--primary-light': primaryLight,
      '--secondary-color': secondary,
      '--accent-color': accent,
      '--background-color': background,
      '--surface-color': surface,
      '--text-primary': textPrimary,
      '--text-secondary': textSecondary,
      '--border-color': hslToHex(h, Math.max(0, s - 50), 85)
    }
  }

  // Simple color conversion functions for theme generation
  const hexToHsl = (hex: string): [number, number, number] => {
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

  const hslToHex = (h: number, s: number, l: number): string => {
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

  // Apply dynamic theme to document root
  React.useEffect(() => {
    const root = document.documentElement
    const theme = generateDynamicTheme(primaryColor)
    
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }, [primaryColor])

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Color Palette Generator</h1>
        <p className="subtitle">Enter a hex color to generate a beautiful supporting palette</p>
      </header>

      <main className="main">
        <ColorInput onGeneratePalette={handleGeneratePalette} />
        
        {showPalette && palette && (
          <ColorPalette palette={palette} />
        )}
      </main>

      <footer className="footer">
        <p>Aal / <a href="https://github.com/MobiusAR" target="_blank" rel="noopener noreferrer">@MobiusAR</a></p>
      </footer>
    </div>
  )
}

export default App
