import React, { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import LegalRepository from '../components/legal/LegalRepository'
import AILegalQA from '../components/ai/AILegalQA'
import BudgetDashboard from '../features/budget/BudgetDashboard'
import CitizenReviews from '../components/reviews/CitizenReviews'
import InstitutionsPage from '../components/institutions/InstitutionsPage'
import LoginPage from '../components/auth/LoginPage'
import RegisterPage from '../components/auth/RegisterPage'
import GovernmentHierarchy from '../components/hierarchy/GovernmentHierarchy'
import MoroccanAnimatedBackground from './components/MoroccanAnimatedBackground'
import AnimatedCounter from './components/AnimatedCounter'
import i18next from 'i18next'

// Import i18n
import '../i18n'

// France Travail inspired design system
const franceTravailStyles = {
  // Colors from France Travail design system
  colors: {
    primary: '#0066cc',        // France Travail blue
    primaryDark: '#004499',    // Darker blue
    secondary: '#f8f9fa',      // Light gray background
    accent: '#00b894',          // Success green
    warning: '#fdcb6e',        // Warning yellow
    danger: '#e17055',         // Error red
    text: {
      primary: '#2d3436',      // Dark gray text
      secondary: '#636e72',    // Medium gray text
      light: '#b2bec3'         // Light gray text
    },
    background: {
      white: '#ffffff',
      light: '#f8f9fa',
      dark: '#2d3436'
    },
    border: {
      light: '#e9ecef',
      medium: '#dee2e6',
      dark: '#adb5bd'
    }
  },
  
  // Typography
  typography: {
    fontFamily: '"Marianne", "Segoe UI", "Roboto", sans-serif',
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px'
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  
  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
  }
}

// France Travail inspired Shell component
const FranceTravailShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: '📊', description: 'Vue d\'ensemble' },
    { name: 'Institutions', href: '/institutions', icon: '🏛️', description: 'Annuaire gouvernemental' },
    { name: 'Hiérarchie', href: '/hierarchy', icon: '👑', description: 'Structure administrative' },
    { name: 'Documents légaux', href: '/legal', icon: '⚖️', description: 'Recherche juridique' },
    { name: 'Assistant IA', href: '/ai', icon: '🤖', description: 'Questions juridiques' },
    { name: 'Avis citoyens', href: '/reviews', icon: '💬', description: 'Évaluations' },
    { name: 'Transparence budgétaire', href: '/budget', icon: '📊', description: 'Données financières' },
  ]

  const styles = {
    container: {
      fontFamily: franceTravailStyles.typography.fontFamily,
      minHeight: '100vh',
      backgroundColor: franceTravailStyles.colors.background.light,
      display: 'flex'
    },
    sidebar: {
      width: isCollapsed ? '0px' : '280px',
      backgroundColor: franceTravailStyles.colors.background.white,
      borderRight: isCollapsed ? 'none' : `1px solid ${franceTravailStyles.colors.border.light}`,
      padding: isCollapsed ? '0px' : franceTravailStyles.spacing.lg,
      boxShadow: isCollapsed ? 'none' : franceTravailStyles.shadows.sm,
      transition: 'width 0.2s ease, padding 0.2s ease, border 0.2s ease',
      overflow: 'hidden'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: franceTravailStyles.spacing.md,
      marginBottom: franceTravailStyles.spacing.xl,
      paddingBottom: franceTravailStyles.spacing.lg,
      borderBottom: `1px solid ${franceTravailStyles.colors.border.light}`
    },
    logoText: {
      fontSize: franceTravailStyles.typography.sizes.lg,
      fontWeight: franceTravailStyles.typography.weights.bold,
      color: franceTravailStyles.colors.primary,
      margin: 0
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: franceTravailStyles.spacing.md,
      padding: `${franceTravailStyles.spacing.md} ${franceTravailStyles.spacing.sm}`,
      marginBottom: franceTravailStyles.spacing.sm,
      borderRadius: franceTravailStyles.borderRadius.md,
      textDecoration: 'none',
      color: franceTravailStyles.colors.text.primary,
      fontSize: franceTravailStyles.typography.sizes.sm,
      fontWeight: franceTravailStyles.typography.weights.medium,
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    navItemActive: {
      backgroundColor: franceTravailStyles.colors.primary + '10',
      color: franceTravailStyles.colors.primary,
      fontWeight: franceTravailStyles.typography.weights.semibold
    },
    navIcon: {
      fontSize: '18px',
      width: '20px',
      textAlign: 'center' as const
    },
    navText: {
      flex: 1,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: isCollapsed ? 'none' : 'block'
    },
    navDescription: {
      fontSize: franceTravailStyles.typography.sizes.xs,
      color: franceTravailStyles.colors.text.secondary,
      marginTop: '2px'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const
    },
    header: {
      backgroundColor: franceTravailStyles.colors.background.white,
      borderBottom: `1px solid ${franceTravailStyles.colors.border.light}`,
      padding: `${franceTravailStyles.spacing.md} ${franceTravailStyles.spacing.lg}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: franceTravailStyles.shadows.sm
    },
    headerTitle: {
      fontSize: franceTravailStyles.typography.sizes.xl,
      fontWeight: franceTravailStyles.typography.weights.semibold,
      color: franceTravailStyles.colors.text.primary,
      margin: 0
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: franceTravailStyles.spacing.md
    },
    userInfo: {
      textAlign: 'right' as const
    },
    userName: {
      fontSize: franceTravailStyles.typography.sizes.sm,
      fontWeight: franceTravailStyles.typography.weights.medium,
      color: franceTravailStyles.colors.text.primary,
      margin: 0
    },
    userRole: {
      fontSize: franceTravailStyles.typography.sizes.xs,
      color: franceTravailStyles.colors.text.secondary,
      margin: 0
    },
    logoutButton: {
      backgroundColor: 'transparent',
      border: `1px solid ${franceTravailStyles.colors.border.medium}`,
      color: franceTravailStyles.colors.text.primary,
      padding: `${franceTravailStyles.spacing.sm} ${franceTravailStyles.spacing.md}`,
      borderRadius: franceTravailStyles.borderRadius.sm,
      fontSize: franceTravailStyles.typography.sizes.sm,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    content: {
      flex: 1,
      padding: franceTravailStyles.spacing.lg,
      backgroundColor: franceTravailStyles.colors.background.light
    }
  }

  return (
    <div style={styles.container} className="text-white selection:bg-cyan-300/20 selection:text-cyan-100">
      <MoroccanAnimatedBackground />
      {/* Sidebar */}
      <div style={styles.sidebar} className="backdrop-blur-sm bg-white/5 border-r border-white/10">
        <div style={styles.logo}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: franceTravailStyles.colors.primary,
            borderRadius: franceTravailStyles.borderRadius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
          }} className="shadow-[0_0_24px_rgba(14,165,177,0.35)]">
            C
          </div>
          <div>
            <h1 style={styles.logoText} className="bg-gradient-to-r from-cyan-300 to-amber-200 bg-clip-text text-transparent">Convergence</h1>
            <p style={{
              fontSize: franceTravailStyles.typography.sizes.xs,
              color: franceTravailStyles.colors.text.secondary,
              margin: 0
            }} className="text-white/60">
              Plateforme civique
            </p>
          </div>
        </div>
        
        <nav>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Link
                  to={item.href}
                  style={{
                    ...styles.navItem,
                    ...(isActive ? styles.navItemActive : {})
                  }}
                >
                  <span style={styles.navIcon} title={item.name}>{item.icon}</span>
                  <div style={styles.navText}>
                    <div>{item.name}</div>
                    <div style={styles.navDescription}>{item.description}</div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header} className="backdrop-blur-sm bg-white/5 border-b border-white/10">
          {/* Sidebar toggle button */}
          <motion.button
            aria-label={isCollapsed ? 'Ouvrir le menu latéral' : 'Replier le menu latéral'}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              border: `1px solid ${franceTravailStyles.colors.border.medium}`,
              background: 'white',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              marginRight: franceTravailStyles.spacing.md
            }}
            className="bg-white/10 text-white border-white/20 hover:border-cyan-300/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? '☰' : '✕'}
          </motion.button>
          <h1 style={styles.headerTitle} className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Plateforme Convergence - Intelligence Civique Nationale
          </h1>
          
          <div style={styles.userMenu}>
            {isAuthenticated && user ? (
              <>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{user.fullName}</p>
                  <p style={styles.userRole}>{user.role}</p>
                </div>
                <button onClick={() => logout()} style={styles.logoutButton} className="hover:bg-white/10">
                  Se déconnecter
                </button>
            </>
          ) : (
              <div style={{ display: 'flex', gap: franceTravailStyles.spacing.md }}>
                <Link to="/login" style={{
                  ...styles.logoutButton,
                  backgroundColor: franceTravailStyles.colors.primary,
                  color: 'white',
                  border: 'none',
                  textDecoration: 'none'
                }} className="bg-cyan-600 hover:bg-cyan-500">
                  Se connecter
                </Link>
                <Link to="/register" style={{
                  ...styles.logoutButton,
                  textDecoration: 'none'
                }} className="hover:bg-white/10">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={styles.content} className="min-h-[60vh]">
        {children}
        </div>
      </div>
    </div>
  )
}

// France Travail inspired Dashboard
const FranceTravailDashboard: React.FC = () => {
  const stats = [
    { name: 'Institutions gouvernementales', value: '6', color: franceTravailStyles.colors.primary, icon: '🏛️' },
    { name: 'Documents légaux', value: '2,847', color: franceTravailStyles.colors.accent, icon: '⚖️' },
    { name: 'Avis citoyens', value: '1,234', color: franceTravailStyles.colors.warning, icon: '💬' },
    { name: 'Requêtes IA', value: '567', color: franceTravailStyles.colors.danger, icon: '🤖' }
  ]

  const quickActions = [
    { title: 'Institutions gouvernementales', description: 'Parcourir l\'annuaire gouvernemental', href: '/institutions', color: franceTravailStyles.colors.primary },
    { title: 'Hiérarchie gouvernementale', description: 'Explorer la structure administrative', href: '/hierarchy', color: franceTravailStyles.colors.accent },
    { title: 'Documents légaux', description: 'Rechercher lois et réglementations', href: '/legal', color: franceTravailStyles.colors.danger },
    { title: 'Assistant IA juridique', description: 'Poser des questions juridiques', href: '/ai', color: franceTravailStyles.colors.warning },
    { title: 'Avis citoyens', description: 'Évaluer fonctionnaires et services', href: '/reviews', color: franceTravailStyles.colors.accent },
    { title: 'Transparence budgétaire', description: 'Explorer les données budgétaires', href: '/budget', color: franceTravailStyles.colors.primary },
  ]

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    welcomeCard: {
      backgroundColor: franceTravailStyles.colors.background.white,
      padding: franceTravailStyles.spacing.xl,
      borderRadius: franceTravailStyles.borderRadius.lg,
      marginBottom: franceTravailStyles.spacing.lg,
      boxShadow: franceTravailStyles.shadows.md,
      border: `1px solid ${franceTravailStyles.colors.border.light}`
    },
    welcomeTitle: {
      fontSize: franceTravailStyles.typography.sizes['3xl'],
      fontWeight: franceTravailStyles.typography.weights.bold,
      color: franceTravailStyles.colors.text.primary,
      margin: '0 0 16px 0'
    },
    welcomeSubtitle: {
      fontSize: franceTravailStyles.typography.sizes.lg,
      color: franceTravailStyles.colors.text.secondary,
      margin: '0 0 24px 0',
      lineHeight: 1.5
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: franceTravailStyles.spacing.lg,
      marginBottom: franceTravailStyles.spacing.xl
    },
    statCard: {
      backgroundColor: franceTravailStyles.colors.background.white,
      padding: franceTravailStyles.spacing.lg,
      borderRadius: franceTravailStyles.borderRadius.lg,
      boxShadow: franceTravailStyles.shadows.md,
      border: `1px solid ${franceTravailStyles.colors.border.light}`,
      textAlign: 'center' as const
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: franceTravailStyles.spacing.md
    },
    statValue: {
      fontSize: franceTravailStyles.typography.sizes['4xl'],
      fontWeight: franceTravailStyles.typography.weights.bold,
      margin: '0 0 8px 0'
    },
    statName: {
      fontSize: franceTravailStyles.typography.sizes.sm,
      color: franceTravailStyles.colors.text.secondary,
      margin: 0
    },
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: franceTravailStyles.spacing.lg
    },
    actionCard: {
      backgroundColor: franceTravailStyles.colors.background.white,
      padding: franceTravailStyles.spacing.lg,
      borderRadius: franceTravailStyles.borderRadius.lg,
      boxShadow: franceTravailStyles.shadows.md,
      border: `1px solid ${franceTravailStyles.colors.border.light}`,
      textDecoration: 'none',
      color: 'inherit',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    actionTitle: {
      fontSize: franceTravailStyles.typography.sizes.lg,
      fontWeight: franceTravailStyles.typography.weights.semibold,
      margin: '0 0 8px 0',
      color: franceTravailStyles.colors.text.primary
    },
    actionDescription: {
      fontSize: franceTravailStyles.typography.sizes.sm,
      color: franceTravailStyles.colors.text.secondary,
      margin: 0,
      lineHeight: 1.4
    }
  }

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeCard} className="backdrop-blur-sm bg-white/5 border border-white/10">
        <h1 style={styles.welcomeTitle}>
          Bienvenue sur Convergence
        </h1>
        <p style={styles.welcomeSubtitle}>
          La plateforme d'intelligence civique nationale du Maroc pour la transparence gouvernementale et l'engagement citoyen.
        </p>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            style={styles.statCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
          >
            <div style={styles.statIcon}>{stat.icon}</div>
            <AnimatedCounter value={stat.value} color={stat.color} />
            <p style={styles.statName}>{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{
          fontSize: franceTravailStyles.typography.sizes['2xl'],
          fontWeight: franceTravailStyles.typography.weights.semibold,
          color: franceTravailStyles.colors.text.primary,
          margin: `0 0 ${franceTravailStyles.spacing.lg} 0`
        }}>
          Accès rapide
        </h2>
        
        <div style={styles.actionsGrid}>
          {quickActions.map((action, idx) => (
            <motion.div key={action.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * idx }}>
              <Link
                to={action.href}
                style={styles.actionCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = franceTravailStyles.shadows.lg
                  e.currentTarget.style.borderColor = action.color
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = franceTravailStyles.shadows.md
                  e.currentTarget.style.borderColor = franceTravailStyles.colors.border.light
                }}
              >
                <h3 style={styles.actionTitle}>{action.title}</h3>
                <p style={styles.actionDescription}>{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const App: React.FC = () => {
  const { token, login } = useAuthStore()

  // Initialize authentication from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken && !token) {
      // In a real app, you'd validate the token and get user info
      login(storedToken, {
        id: 1,
        email: 'user@convergence.ma',
        fullName: 'Test User',
        role: 'Citizen',
        isVerified: true
      })
    }
  }, [token, login])

  // Auto-RTL support based on current language (Arabic => rtl)
  useEffect(() => {
    const updateDir = () => {
      const lang = i18next.language || 'fr'
      const isRTL = lang.toLowerCase().startsWith('ar')
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
    }
    updateDir()
    const handler = () => updateDir()
    i18next.on('languageChanged', handler)
    return () => {
      i18next.off('languageChanged', handler)
    }
  }, [])

  return (
      <BrowserRouter>
      <FranceTravailShell>
          <Routes>
          <Route path="/" element={<FranceTravailDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/institutions" element={<InstitutionsPage />} />
          <Route path="/hierarchy" element={<GovernmentHierarchy />} />
          <Route path="/legal" element={<LegalRepository />} />
          <Route path="/ai" element={<AILegalQA />} />
          <Route path="/reviews" element={<CitizenReviews />} />
          <Route path="/budget" element={<BudgetDashboard />} />
          </Routes>
      </FranceTravailShell>
      </BrowserRouter>
  )
}