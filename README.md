# Color Palette Generator - React App

A beautiful, modern React application that generates professional color palettes based on color theory principles. Simply enter a hex color code and get a complete supporting palette with multiple color harmonies.

## Features

- **Color Input**: Enter any hex color code with real-time validation
- **Multiple Harmonies**: Generate analogous, complementary, triadic, and monochromatic colors
- **Color Information**: View hex, RGB, and HSL values for each color
- **Interactive UI**: Click on color swatches to copy hex codes
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful gradients, shadows, and smooth animations

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS Variables** for consistent theming
- **Responsive Grid Layout** with CSS Grid
- **Modern CSS Features** including gradients and animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd color-palette-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## How It Works

The app uses advanced color theory algorithms to generate harmonious color palettes:

1. **Primary Color**: The color you input
2. **Analogous Colors**: Colors adjacent on the color wheel (30° apart)
3. **Complementary Color**: Color opposite on the color wheel (180° apart)
4. **Triadic Colors**: Three colors equally spaced around the color wheel (120° apart)
5. **Monochromatic Colors**: Variations of the same hue with different saturation/lightness

## Color Conversion

The app performs real-time color space conversions:
- **Hex to HSL**: For color theory calculations
- **HSL to Hex**: For generating new colors
- **Hex to RGB**: For display purposes
- **HSL to RGB**: For additional color information

## Project Structure

```
src/
├── components/          # React components
│   ├── ColorInput.tsx  # Color input and validation
│   └── ColorPalette.tsx # Palette display
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Color utility functions
│   └── colorUtils.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
├── App.css             # Main component styles
└── index.css           # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

---

Built with ❤️ for designers and developers
