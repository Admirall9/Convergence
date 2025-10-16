import React from 'react'

// Futuristic Moroccan Design System
export const moroccanTheme = {
  // Moroccan-inspired color palette with futuristic touches
  colors: {
    // Primary Moroccan colors with cyberpunk accents
    primary: {
      50: '#f0f9ff',   // Light blue
      100: '#e0f2fe',  // Sky blue
      200: '#bae6fd',  // Light cyan
      300: '#7dd3fc',  // Cyan
      400: '#38bdf8',  // Bright cyan
      500: '#0ea5e9',  // Ocean blue
      600: '#0284c7',  // Deep blue
      700: '#0369a1',  // Royal blue
      800: '#075985',  // Navy blue
      900: '#0c4a6e',  // Dark navy
    },
    
    // Moroccan red with neon accents
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',  // Moroccan red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    
    // Gold/amber for luxury feel
    gold: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Moroccan gold
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    // Green for nature/Islam
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Islamic green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Neutral colors with Moroccan warmth
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    // Cyberpunk accents
    cyber: {
      neon: '#00ffff',      // Cyan neon
      purple: '#8b5cf6',    // Purple neon
      pink: '#ec4899',      // Pink neon
      orange: '#f97316',    // Orange neon
    }
  },
  
  // Typography with Arabic-friendly fonts
  typography: {
    fontFamily: {
      primary: '"Inter", "Segoe UI", "Roboto", sans-serif',
      arabic: '"Noto Sans Arabic", "Amiri", "Scheherazade New", serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    }
  },
  
  // Spacing system
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  // Border radius with Moroccan geometric patterns
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    full: '9999px',
  },
  
  // Shadows with depth and glow effects
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(14, 165, 233, 0.3)',
    neon: '0 0 30px rgba(0, 255, 255, 0.5)',
  },
  
  // Animations and transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  
  // Gradients inspired by Moroccan patterns
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    accent: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    gold: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    green: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    cyber: 'linear-gradient(135deg, #00ffff 0%, #8b5cf6 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)',
    ocean: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
  }
}

// Moroccan geometric patterns as CSS classes
export const moroccanPatterns = {
  // Zellige-inspired patterns
  zellige: `
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%);
  `,
  
  // Islamic geometric patterns
  geometric: `
    background-image: 
      linear-gradient(45deg, rgba(14, 165, 233, 0.1) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(239, 68, 68, 0.1) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(34, 197, 94, 0.1) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(245, 158, 11, 0.1) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  `,
  
  // Futuristic grid
  grid: `
    background-image: 
      linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  `,
  
  // Moroccan tiles
  tiles: `
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 20%);
    background-size: 40px 40px;
  `
}

// Utility function to get theme values
export const getThemeValue = (path: string) => {
  const keys = path.split('.')
  let value: any = moroccanTheme
  for (const key of keys) {
    value = value[key]
    if (value === undefined) return undefined
  }
  return value
}

// CSS-in-JS helper for creating styled components
export const createStyledComponent = (baseStyles: React.CSSProperties, theme: any = moroccanTheme) => {
  return (additionalStyles?: React.CSSProperties) => ({
    ...baseStyles,
    ...additionalStyles,
  })
}

export default moroccanTheme
