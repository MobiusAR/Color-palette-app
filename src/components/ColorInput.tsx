import React, { useState, useEffect } from 'react'

interface ColorInputProps {
  onGeneratePalette: (hexColor: string) => void
}

const ColorInput: React.FC<ColorInputProps> = ({ onGeneratePalette }) => {
  const [hexColor, setHexColor] = useState('#D2691E')
  const [isValid, setIsValid] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex)
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Auto-add # if user types without it
    if (value.length > 0 && !value.startsWith('#')) {
      value = '#' + value
    }
    
    setHexColor(value)
    setIsValid(value.length === 0 || isValidHex(value))
    
    // Show preview after a short delay
    if (isValidHex(value)) {
      setTimeout(() => setShowPreview(true), 300)
    } else {
      setShowPreview(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleGenerate()
    }
  }

  const handleGenerate = () => {
    if (isValid && isValidHex(hexColor)) {
      onGeneratePalette(hexColor)
    }
  }

  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  useEffect(() => {
    setIsValid(isValidHex(hexColor))
  }, [hexColor])

  return (
    <div className="color-input-section">
      <div className="input-group">
        <label htmlFor="hexInput" className="input-label">
          Primary Color (Hex)
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            id="hexInput"
            className={`hex-input ${!isValid ? 'invalid' : ''}`}
            placeholder="#D2691E"
            maxLength={7}
            value={hexColor}
            onChange={handleHexChange}
            onKeyPress={handleKeyPress}
          />
          <div 
            className="color-preview" 
            style={{ backgroundColor: isValid ? hexColor : '#ccc' }}
          />
        </div>
        
        {isValid && isValidHex(hexColor) && (
          <div className="color-feedback">
            <span className="valid-indicator">✓ Valid color</span>
            <span className="color-name">{getColorName(hexColor)}</span>
          </div>
        )}
        
        {!isValid && hexColor.length > 0 && (
          <div className="color-feedback error">
            <span className="error-indicator">✗ Invalid hex color</span>
            <span className="error-hint">Use format: #RRGGBB</span>
          </div>
        )}
        
        <button 
          className="generate-btn"
          onClick={handleGenerate}
          disabled={!isValid || !isValidHex(hexColor)}
        >
          Generate Palette
        </button>
      </div>

      {showPreview && isValid && (
        <div className="theme-preview">
          <h3>🎨 Theme Preview</h3>
          <p>This is how your site will look with the selected color:</p>
          <div className="preview-elements">
            <div className="preview-button" style={{ backgroundColor: hexColor, color: getContrastColor(hexColor) }}>
              Primary Button
            </div>
            <div className="preview-link" style={{ color: hexColor }}>
              Primary Link
            </div>
            <div className="preview-accent" style={{ backgroundColor: getComplementaryColor(hexColor), color: getContrastColor(getComplementaryColor(hexColor)) }}>
              Accent Element
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get color name
const getColorName = (hex: string): string => {
  const colorNames: { [key: string]: string } = {
    '#D2691E': 'Chocolate',
    '#FF6B6B': 'Coral Red',
    '#4ECDC4': 'Turquoise',
    '#45B7D1': 'Sky Blue',
    '#96CEB4': 'Sage Green',
    '#FFEAA7': 'Cream Yellow',
    '#DDA0DD': 'Plum',
    '#98D8C8': 'Mint Green',
    '#F7DC6F': 'Golden Yellow',
    '#BB8FCE': 'Lavender',
    '#85C1E9': 'Light Blue'
  }
  
  return colorNames[hex] || 'Custom Color'
}

// Helper function to get complementary color
const getComplementaryColor = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  const rComp = (255 - r).toString(16).padStart(2, '0')
  const gComp = (255 - g).toString(16).padStart(2, '0')
  const bComp = (255 - b).toString(16).padStart(2, '0')
  
  return `#${rComp}${gComp}${bComp}`
}

export default ColorInput
