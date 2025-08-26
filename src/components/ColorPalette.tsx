import React from 'react'
import { ColorPaletteData } from '../types'
import { getContrastRatio, isAccessible } from '../utils/colorUtils'

interface ColorPaletteProps {
  palette: ColorPaletteData
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ palette }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here in the future
      console.log('Color copied to clipboard:', text)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
  }

  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  const getColorSchemeType = (): string => {
    const [h] = hexToHsl(palette.primary.hex)
    if (h >= 0 && h < 30) return 'Warm & Energetic'
    if (h >= 30 && h < 60) return 'Warm & Inviting'
    if (h >= 60 && h < 120) return 'Fresh & Natural'
    if (h >= 120 && h < 180) return 'Calm & Trustworthy'
    if (h >= 180 && h < 240) return 'Professional & Stable'
    if (h >= 240 && h < 300) return 'Creative & Luxurious'
    return 'Elegant & Sophisticated'
  }

  const getAccessibilityScore = (): { score: number; level: string; description: string } => {
    const primaryContrast = getContrastRatio(palette.primary.hex, palette.background.hex)
    const secondaryContrast = getContrastRatio(palette.secondary.hex, palette.background.hex)
    const accentContrast = getContrastRatio(palette.accent.hex, palette.background.hex)
    
    const avgContrast = (primaryContrast + secondaryContrast + accentContrast) / 3
    
    if (avgContrast >= 7) {
      return { score: avgContrast, level: 'AAA', description: 'Excellent contrast - meets highest accessibility standards' }
    } else if (avgContrast >= 4.5) {
      return { score: avgContrast, level: 'AA', description: 'Good contrast - meets accessibility standards' }
    } else {
      return { score: avgContrast, level: 'Fail', description: 'Poor contrast - may cause accessibility issues' }
    }
  }

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

  const accessibilityScore = getAccessibilityScore()

  return (
    <div className="palette-section">
      <div className="palette-header">
        <h2 className="palette-title">Your Color Palette</h2>
        <div className="scheme-info">
          <span className="scheme-type">{getColorSchemeType()}</span>
          <span className="scheme-description">Color scheme based on your primary color</span>
        </div>
        <div className="accessibility-score">
          <div className={`score-badge ${accessibilityScore.level.toLowerCase()}`}>
            {accessibilityScore.level} Accessibility
          </div>
          <span className="score-description">{accessibilityScore.description}</span>
        </div>
      </div>
      
      <div className="dashboard-preview">
        <h3>🎨 Dashboard Preview</h3>
        <p>See how your colors work together in a real dashboard layout. Click any element to copy its color!</p>
        
        <div className="mini-dashboard">
          {/* Header */}
          <div className="dashboard-header" style={{ backgroundColor: palette.primary.hex }}>
            <div className="header-content">
              <h4 style={{ color: getContrastColor(palette.primary.hex) }}>Dashboard</h4>
              <div className="header-actions">
                <button 
                  className="header-btn"
                  style={{ backgroundColor: palette.secondary.hex, color: getContrastColor(palette.secondary.hex) }}
                  onClick={() => copyToClipboard(palette.secondary.hex)}
                  title={`Click to copy ${palette.secondary.hex}`}
                >
                  Profile
                </button>
                <button 
                  className="header-btn"
                  style={{ backgroundColor: palette.accent.hex, color: getContrastColor(palette.accent.hex) }}
                  onClick={() => copyToClipboard(palette.accent.hex)}
                  title={`Click to copy ${palette.accent.hex}`}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="dashboard-sidebar" style={{ backgroundColor: palette.monochromatic1.hex }}>
            <div className="sidebar-item" style={{ backgroundColor: palette.primary.hex, color: getContrastColor(palette.primary.hex) }}>
              Dashboard
            </div>
            <div className="sidebar-item" style={{ backgroundColor: 'transparent', color: getContrastColor(palette.monochromatic1.hex) }}>
              Analytics
            </div>
            <div className="sidebar-item" style={{ backgroundColor: 'transparent', color: getContrastColor(palette.monochromatic1.hex) }}>
              Reports
            </div>
            <div className="sidebar-item" style={{ backgroundColor: 'transparent', color: getContrastColor(palette.monochromatic1.hex) }}>
              Users
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-main" style={{ backgroundColor: palette.background.hex }}>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div 
                className="stat-card" 
                style={{ backgroundColor: palette.secondary.hex, color: getContrastColor(palette.secondary.hex) }}
                onClick={() => copyToClipboard(palette.secondary.hex)}
                title={`Click to copy ${palette.secondary.hex}`}
              >
                <h5>Total Users</h5>
                <span className="stat-number">12,847</span>
                <span className="stat-change">+12%</span>
              </div>
              <div 
                className="stat-card" 
                style={{ backgroundColor: palette.analogous1.hex, color: getContrastColor(palette.analogous1.hex) }}
                onClick={() => copyToClipboard(palette.analogous1.hex)}
                title={`Click to copy ${palette.analogous1.hex}`}
              >
                <h5>Revenue</h5>
                <span className="stat-number">$45,291</span>
                <span className="stat-change">+8%</span>
              </div>
              <div 
                className="stat-card" 
                style={{ backgroundColor: palette.triadic1.hex, color: getContrastColor(palette.triadic1.hex) }}
                onClick={() => copyToClipboard(palette.triadic1.hex)}
                title={`Click to copy ${palette.triadic1.hex}`}
              >
                <h5>Orders</h5>
                <span className="stat-number">1,234</span>
                <span className="stat-change">+15%</span>
              </div>
            </div>

            {/* Chart Area */}
            <div 
              className="chart-area" 
              style={{ backgroundColor: palette.monochromatic2.hex, color: getContrastColor(palette.monochromatic2.hex) }}
              onClick={() => copyToClipboard(palette.monochromatic2.hex)}
              title={`Click to copy ${palette.monochromatic2.hex}`}
            >
              <h5>Monthly Growth</h5>
              <div className="chart-placeholder">
                <span>Chart visualization would go here</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="primary-btn"
                style={{ backgroundColor: palette.primary.hex, color: getContrastColor(palette.primary.hex) }}
                onClick={() => copyToClipboard(palette.primary.hex)}
                title={`Click to copy ${palette.primary.hex}`}
              >
                Primary Action
              </button>
              <button 
                className="secondary-btn"
                style={{ backgroundColor: palette.accent.hex, color: getContrastColor(palette.accent.hex) }}
                onClick={() => copyToClipboard(palette.accent.hex)}
                title={`Click to copy ${palette.accent.hex}`}
              >
                Secondary Action
              </button>
            </div>
          </div>
        </div>

        {/* Color Legend */}
        <div className="color-legend">
          <h4>Color Usage Guide</h4>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: palette.primary.hex }}></div>
              <div className="legend-info">
                <strong>{palette.primary.name} ({palette.primary.hex})</strong>
                <span>{palette.primary.usage}</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: palette.secondary.hex }}></div>
              <div className="legend-info">
                <strong>{palette.secondary.name} ({palette.secondary.hex})</strong>
                <span>{palette.secondary.usage}</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: palette.accent.hex }}></div>
              <div className="legend-info">
                <strong>{palette.accent.name} ({palette.accent.hex})</strong>
                <span>{palette.accent.usage}</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: palette.background.hex }}></div>
              <div className="legend-info">
                <strong>{palette.background.name} ({palette.background.hex})</strong>
                <span>{palette.background.usage}</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: palette.textPrimary.hex }}></div>
              <div className="legend-info">
                <strong>{palette.textPrimary.name} ({palette.textPrimary.hex})</strong>
                <span>{palette.textPrimary.usage}</span>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: palette.textSecondary.hex }}></div>
              <div className="legend-info">
                <strong>{palette.textSecondary.name} ({palette.textSecondary.hex})</strong>
                <span>{palette.textSecondary.usage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="palette-info">
        <div className="info-card primary-card">
          <h3>Primary Color</h3>
          <div className="color-preview-large" style={{ backgroundColor: palette.primary.hex }}>
            <span style={{ color: getContrastColor(palette.primary.hex) }}>
              {palette.primary.hex}
            </span>
          </div>
          <p className="color-description">{palette.primary.usage}</p>
          <div className="color-codes">
            <p>{palette.primary.hex}</p>
            <p>{palette.primary.rgb}</p>
            <p>{palette.primary.hsl}</p>
          </div>
        </div>
        
        <div className="info-card">
          <h3>Secondary Color</h3>
          <div className="color-preview-small" style={{ backgroundColor: palette.secondary.hex }}>
            <span style={{ color: getContrastColor(palette.secondary.hex) }}>
              {palette.secondary.hex}
            </span>
          </div>
          <p className="color-description">{palette.secondary.usage}</p>
          <div className="color-codes">
            <p>{palette.secondary.hex}</p>
            <p>{palette.secondary.rgb}</p>
            <p>{palette.secondary.hsl}</p>
          </div>
        </div>
        
        <div className="info-card">
          <h3>Accent Color</h3>
          <div className="color-preview-small" style={{ backgroundColor: palette.accent.hex }}>
            <span style={{ color: getContrastColor(palette.accent.hex) }}>
              {palette.accent.hex}
            </span>
          </div>
          <p className="color-description">{palette.accent.usage}</p>
          <div className="color-codes">
            <p>{palette.accent.hex}</p>
            <p>{palette.accent.rgb}</p>
            <p>{palette.accent.hsl}</p>
          </div>
        </div>
        
        <div className="info-card">
          <h3>Background Color</h3>
          <div className="color-preview-small" style={{ backgroundColor: palette.background.hex }}>
            <span style={{ color: getContrastColor(palette.background.hex) }}>
              {palette.background.hex}
            </span>
          </div>
          <p className="color-description">{palette.background.usage}</p>
          <div className="color-codes">
            <p>{palette.background.hex}</p>
            <p>{palette.background.rgb}</p>
            <p>{palette.background.hsl}</p>
          </div>
        </div>
      </div>

      <div className="usage-tips">
        <h3>💡 UI/UX Best Practices</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>🎨 Primary (40%)</h4>
            <p>Use for main actions, primary buttons, links, and brand elements. This is your main brand color.</p>
          </div>
          <div className="tip">
            <h4>🔄 Secondary (30%)</h4>
            <p>Use for secondary actions, backgrounds, and supporting elements. Provides visual hierarchy.</p>
          </div>
          <div className="tip">
            <h4>✨ Accent (20%)</h4>
            <p>Use for CTAs, important actions, and highlights. This color should stand out and draw attention.</p>
          </div>
          <div className="tip">
            <h4>🌫️ Background (10%)</h4>
            <p>Use for main backgrounds. Provides contrast and ensures text readability meets accessibility standards.</p>
          </div>
        </div>
      </div>

      <div className="accessibility-info">
        <h3>♿ Accessibility Information</h3>
        <div className="accessibility-grid">
          <div className="accessibility-item">
            <h4>Contrast Ratios</h4>
            <div className="contrast-info">
              <div className="contrast-pair">
                <span>Primary on Background: {getContrastRatio(palette.primary.hex, palette.background.hex).toFixed(2)}</span>
                <span className={`status ${isAccessible(palette.primary.hex, palette.background.hex) ? 'pass' : 'fail'}`}>
                  {isAccessible(palette.primary.hex, palette.background.hex) ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="contrast-pair">
                <span>Secondary on Background: {getContrastRatio(palette.secondary.hex, palette.background.hex).toFixed(2)}</span>
                <span className={`status ${isAccessible(palette.secondary.hex, palette.background.hex) ? 'pass' : 'fail'}`}>
                  {isAccessible(palette.secondary.hex, palette.background.hex) ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="contrast-pair">
                <span>Accent on Background: {getContrastRatio(palette.accent.hex, palette.background.hex).toFixed(2)}</span>
                <span className={`status ${isAccessible(palette.accent.hex, palette.background.hex) ? 'pass' : 'fail'}`}>
                  {isAccessible(palette.accent.hex, palette.background.hex) ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
            </div>
          </div>
          <div className="accessibility-item">
            <h4>WCAG Compliance</h4>
            <p>Your palette meets <strong>{accessibilityScore.level}</strong> accessibility standards with an average contrast ratio of <strong>{accessibilityScore.score.toFixed(2)}</strong>.</p>
            <p className="accessibility-note">
              {accessibilityScore.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorPalette
