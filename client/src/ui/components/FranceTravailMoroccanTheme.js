// France Travail inspired design system with Moroccan flag colors
export const franceTravailMoroccanTheme = {
    // Moroccan flag colors (red and green) with France Travail structure
    colors: {
        // Primary colors based on Moroccan flag
        primary: {
            50: '#f0fdf4', // Light green
            100: '#dcfce7', // Green
            200: '#bbf7d0', // Medium green
            300: '#86efac', // Green
            400: '#4ade80', // Green
            500: '#22c55e', // Moroccan green (main)
            600: '#16a34a', // Dark green
            700: '#15803d', // Darker green
            800: '#166534', // Very dark green
            900: '#14532d', // Darkest green
        },
        // Secondary colors (Moroccan red)
        secondary: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Moroccan red (main)
            600: '#dc2626', // Dark red
            700: '#b91c1c', // Darker red
            800: '#991b1b', // Very dark red
            900: '#7f1d1d', // Darkest red
        },
        // Neutral colors (France Travail style)
        neutral: {
            50: '#fafafa', // Very light gray
            100: '#f5f5f5', // Light gray
            200: '#e5e5e5', // Light gray
            300: '#d4d4d4', // Medium light gray
            400: '#a3a3a3', // Medium gray
            500: '#737373', // Gray
            600: '#525252', // Dark gray
            700: '#404040', // Darker gray
            800: '#262626', // Very dark gray
            900: '#171717', // Darkest gray
        },
        // Status colors
        success: '#22c55e', // Green
        warning: '#f59e0b', // Amber
        error: '#ef4444', // Red
        info: '#3b82f6', // Blue
        // Background colors
        background: {
            white: '#ffffff',
            light: '#f8fafc',
            dark: '#1e293b',
        },
        // Text colors
        text: {
            primary: '#1e293b', // Dark slate
            secondary: '#64748b', // Slate
            light: '#94a3b8', // Light slate
            white: '#ffffff',
        },
        // Border colors
        border: {
            light: '#e2e8f0',
            medium: '#cbd5e1',
            dark: '#94a3b8',
        }
    },
    // Typography (France Travail style)
    typography: {
        fontFamily: {
            primary: '"Marianne", "Inter", "Segoe UI", "Roboto", sans-serif',
            arabic: '"Noto Sans Arabic", "Amiri", "Scheherazade New", serif',
            mono: '"JetBrains Mono", "Fira Code", monospace',
        },
        sizes: {
            xs: '0.75rem', // 12px
            sm: '0.875rem', // 14px
            base: '1rem', // 16px
            lg: '1.125rem', // 18px
            xl: '1.25rem', // 20px
            '2xl': '1.5rem', // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem', // 36px
            '5xl': '3rem', // 48px
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
    // Spacing system (France Travail style)
    spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '3rem', // 48px
        '3xl': '4rem', // 64px
        '4xl': '6rem', // 96px
    },
    // Border radius (France Travail style)
    borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px
        md: '0.5rem', // 8px
        lg: '0.75rem', // 12px
        xl: '1rem', // 16px
        '2xl': '1.5rem', // 24px
        full: '9999px',
    },
    // Shadows (France Travail style)
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    // Transitions
    transitions: {
        fast: '150ms ease-in-out',
        normal: '300ms ease-in-out',
        slow: '500ms ease-in-out',
    },
    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        secondary: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        moroccan: 'linear-gradient(135deg, #22c55e 0%, #ef4444 100%)',
        subtle: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    }
};
// France Travail component styles
export const franceTravailStyles = {
    // Header styles
    header: {
        backgroundColor: franceTravailMoroccanTheme.colors.background.white,
        borderBottom: `1px solid ${franceTravailMoroccanTheme.colors.border.light}`,
        boxShadow: franceTravailMoroccanTheme.shadows.sm,
    },
    // Navigation styles
    navigation: {
        backgroundColor: franceTravailMoroccanTheme.colors.background.white,
        borderRight: `1px solid ${franceTravailMoroccanTheme.colors.border.light}`,
        boxShadow: franceTravailMoroccanTheme.shadows.sm,
    },
    // Card styles
    card: {
        backgroundColor: franceTravailMoroccanTheme.colors.background.white,
        border: `1px solid ${franceTravailMoroccanTheme.colors.border.light}`,
        borderRadius: franceTravailMoroccanTheme.borderRadius.lg,
        boxShadow: franceTravailMoroccanTheme.shadows.sm,
    },
    // Button styles
    button: {
        primary: {
            backgroundColor: franceTravailMoroccanTheme.colors.primary[500],
            color: franceTravailMoroccanTheme.colors.text.white,
            border: 'none',
            borderRadius: franceTravailMoroccanTheme.borderRadius.md,
            padding: `${franceTravailMoroccanTheme.spacing.sm} ${franceTravailMoroccanTheme.spacing.md}`,
            fontSize: franceTravailMoroccanTheme.typography.sizes.sm,
            fontWeight: franceTravailMoroccanTheme.typography.weights.medium,
            transition: franceTravailMoroccanTheme.transitions.fast,
            cursor: 'pointer',
        },
        secondary: {
            backgroundColor: 'transparent',
            color: franceTravailMoroccanTheme.colors.primary[500],
            border: `1px solid ${franceTravailMoroccanTheme.colors.primary[500]}`,
            borderRadius: franceTravailMoroccanTheme.borderRadius.md,
            padding: `${franceTravailMoroccanTheme.spacing.sm} ${franceTravailMoroccanTheme.spacing.md}`,
            fontSize: franceTravailMoroccanTheme.typography.sizes.sm,
            fontWeight: franceTravailMoroccanTheme.typography.weights.medium,
            transition: franceTravailMoroccanTheme.transitions.fast,
            cursor: 'pointer',
        },
        danger: {
            backgroundColor: franceTravailMoroccanTheme.colors.secondary[500],
            color: franceTravailMoroccanTheme.colors.text.white,
            border: 'none',
            borderRadius: franceTravailMoroccanTheme.borderRadius.md,
            padding: `${franceTravailMoroccanTheme.spacing.sm} ${franceTravailMoroccanTheme.spacing.md}`,
            fontSize: franceTravailMoroccanTheme.typography.sizes.sm,
            fontWeight: franceTravailMoroccanTheme.typography.weights.medium,
            transition: franceTravailMoroccanTheme.transitions.fast,
            cursor: 'pointer',
        }
    },
    // Input styles
    input: {
        border: `1px solid ${franceTravailMoroccanTheme.colors.border.medium}`,
        borderRadius: franceTravailMoroccanTheme.borderRadius.md,
        padding: `${franceTravailMoroccanTheme.spacing.sm} ${franceTravailMoroccanTheme.spacing.md}`,
        fontSize: franceTravailMoroccanTheme.typography.sizes.sm,
        transition: franceTravailMoroccanTheme.transitions.fast,
        backgroundColor: franceTravailMoroccanTheme.colors.background.white,
    },
    // Badge styles
    badge: {
        primary: {
            backgroundColor: franceTravailMoroccanTheme.colors.primary[100],
            color: franceTravailMoroccanTheme.colors.primary[700],
            padding: `${franceTravailMoroccanTheme.spacing.xs} ${franceTravailMoroccanTheme.spacing.sm}`,
            borderRadius: franceTravailMoroccanTheme.borderRadius.sm,
            fontSize: franceTravailMoroccanTheme.typography.sizes.xs,
            fontWeight: franceTravailMoroccanTheme.typography.weights.medium,
        },
        secondary: {
            backgroundColor: franceTravailMoroccanTheme.colors.secondary[100],
            color: franceTravailMoroccanTheme.colors.secondary[700],
            padding: `${franceTravailMoroccanTheme.spacing.xs} ${franceTravailMoroccanTheme.spacing.sm}`,
            borderRadius: franceTravailMoroccanTheme.borderRadius.sm,
            fontSize: franceTravailMoroccanTheme.typography.sizes.xs,
            fontWeight: franceTravailMoroccanTheme.typography.weights.medium,
        }
    }
};
export default franceTravailMoroccanTheme;
