// Victorian-era inspired color palette and theme
export const victorianTheme = {
  colors: {
    // Deep, rich Victorian colors
    primary: '#2C1810', // Dark chocolate brown
    secondary: '#8B4513', // Saddle brown
    accent: '#DAA520', // Goldenrod
    background: '#1A0F0A', // Very dark brown
    surface: '#3D2B1F', // Dark brown surface
    cardBg: '#2A1B14', // Card background
    
    // Text colors
    textPrimary: '#F5E6D3', // Cream white
    textSecondary: '#D4C4A8', // Light brown
    textMuted: '#A0916C', // Muted gold
    
    // Accent colors
    gold: '#FFD700', // Pure gold
    darkGold: '#B8860B', // Dark goldenrod
    crimson: '#8B0000', // Dark red
    emerald: '#2E8B57', // Sea green
    
    // Status colors
    success: '#228B22', // Forest green
    warning: '#FF8C00', // Dark orange
    error: '#8B0000', // Dark red
    info: '#4682B4', // Steel blue
    
    // Borders and shadows
    border: '#5D4037', // Brown border
    shadow: 'rgba(0, 0, 0, 0.5)',
    hoverShadow: 'rgba(218, 165, 32, 0.3)', // Goldenrod shadow
  },
  
  typography: {
    // Victorian-inspired fonts
    primaryFont: "'Playfair Display', 'Times New Roman', serif",
    secondaryFont: "'Crimson Text', 'Georgia', serif", 
    decorativeFont: "'Cinzel', 'Times New Roman', serif",
    bodyFont: "'Libre Baskerville', 'Georgia', serif",
    
    // Font sizes
    h1: '3.5rem',
    h2: '2.5rem',
    h3: '2rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem',
    body: '1rem',
    small: '0.875rem',
    tiny: '0.75rem',
    
    // Font weights
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.4)',
    large: '0 8px 16px rgba(0, 0, 0, 0.5)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(218, 165, 32, 0.3)',
  },
  
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
    wide: '1440px',
  },
};

export type VictorianTheme = typeof victorianTheme;
