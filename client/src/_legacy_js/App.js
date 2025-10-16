import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import LegalRepository from '../components/legal/LegalRepository';
import AILegalQA from '../components/ai/AILegalQA';
import BudgetDashboard from '../features/budget/BudgetDashboard';
import CitizenReviews from '../components/reviews/CitizenReviews';
import InstitutionsPage from '../components/institutions/InstitutionsPage';
import LoginPage from '../components/auth/LoginPage';
import RegisterPage from '../components/auth/RegisterPage';
import GovernmentHierarchy from '../components/hierarchy/GovernmentHierarchy';
import AnimatedCounter from './components/AnimatedCounter';
import { franceTravailMoroccanTheme, franceTravailStyles } from './components/FranceTravailMoroccanTheme';
import i18next from 'i18next';
// Import i18n
import '../i18n';
// France Travail inspired design with Moroccan colors
const theme = franceTravailMoroccanTheme;
const styles = franceTravailStyles;
// France Travail inspired Shell component
const FranceTravailShell = ({ children }) => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigation = [
        { name: 'Tableau de bord', href: '/', icon: '📊', description: 'Vue d\'ensemble', color: theme.colors.primary[500] },
        { name: 'Institutions', href: '/institutions', icon: '🏛️', description: 'Annuaire gouvernemental', color: theme.colors.secondary[500] },
        { name: 'Hiérarchie', href: '/hierarchy', icon: '👑', description: 'Structure administrative', color: theme.colors.primary[600] },
        { name: 'Documents légaux', href: '/legal', icon: '⚖️', description: 'Recherche juridique', color: theme.colors.secondary[600] },
        { name: 'Assistant IA', href: '/ai', icon: '🤖', description: 'Questions juridiques', color: theme.colors.primary[700] },
        { name: 'Avis citoyens', href: '/reviews', icon: '💬', description: 'Évaluations', color: theme.colors.secondary[700] },
        { name: 'Transparence budgétaire', href: '/budget', icon: '📊', description: 'Données financières', color: theme.colors.primary[800] },
    ];
    const shellStyles = {
        container: {
            fontFamily: theme.typography.fontFamily.primary,
            minHeight: '100vh',
            backgroundColor: theme.colors.background.light,
            display: 'flex',
        },
        sidebar: {
            width: isCollapsed ? '0px' : '280px',
            backgroundColor: theme.colors.background.white,
            borderRight: isCollapsed ? 'none' : `1px solid ${theme.colors.border.light}`,
            padding: isCollapsed ? '0px' : theme.spacing.lg,
            boxShadow: isCollapsed ? 'none' : theme.shadows.sm,
            transition: theme.transitions.normal,
            overflow: 'hidden',
        },
        logo: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
            paddingBottom: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border.light}`,
        },
        logoText: {
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.primary[500],
            margin: 0,
        },
        navItem: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
            padding: `${theme.spacing.md} ${theme.spacing.sm}`,
            marginBottom: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            textDecoration: 'none',
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
            transition: theme.transitions.fast,
            cursor: 'pointer',
        },
        navItemActive: {
            backgroundColor: theme.colors.primary[50],
            color: theme.colors.primary[600],
            fontWeight: theme.typography.weights.semibold,
            borderLeft: `3px solid ${theme.colors.primary[500]}`,
        },
        navIcon: {
            fontSize: '18px',
            width: '20px',
            textAlign: 'center'
        },
        navText: {
            flex: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: isCollapsed ? 'none' : 'block'
        },
        navDescription: {
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.text.secondary,
            marginTop: '2px'
        },
        main: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            backgroundColor: theme.colors.background.white,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: theme.shadows.sm,
        },
        headerTitle: {
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text.primary,
            margin: 0,
        },
        userMenu: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md
        },
        userInfo: {
            textAlign: 'right'
        },
        userName: {
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.text.primary,
            margin: 0
        },
        userRole: {
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.text.secondary,
            margin: 0
        },
        logoutButton: {
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border.medium}`,
            color: theme.colors.text.primary,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.sizes.sm,
            cursor: 'pointer',
            transition: theme.transitions.fast,
            fontWeight: theme.typography.weights.medium,
        },
        content: {
            flex: 1,
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.background.light,
        }
    };
    return (_jsxs("div", { style: shellStyles.container, children: [_jsxs("div", { style: shellStyles.sidebar, children: [_jsxs("div", { style: shellStyles.logo, children: [_jsx("div", { style: {
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: theme.colors.primary[500],
                                    borderRadius: theme.borderRadius.md,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold'
                                }, children: "\uD83C\uDDF2\uD83C\uDDE6" }), _jsxs("div", { children: [_jsx("h1", { style: shellStyles.logoText, children: "Convergence" }), _jsx("p", { style: {
                                            fontSize: theme.typography.sizes.xs,
                                            color: theme.colors.text.secondary,
                                            margin: 0
                                        }, children: "Plateforme civique" })] })] }), _jsx("nav", { children: navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (_jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { type: 'spring', stiffness: 260, damping: 20 }, children: _jsxs(Link, { to: item.href, style: {
                                        ...shellStyles.navItem,
                                        ...(isActive ? shellStyles.navItemActive : {})
                                    }, onMouseEnter: (e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                                        }
                                    }, onMouseLeave: (e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }, children: [_jsx("span", { style: {
                                                ...shellStyles.navIcon,
                                                color: isActive ? item.color : theme.colors.text.secondary
                                            }, title: item.name, children: item.icon }), _jsxs("div", { style: shellStyles.navText, children: [_jsx("div", { children: item.name }), _jsx("div", { style: shellStyles.navDescription, children: item.description })] })] }) }, item.name));
                        }) })] }), _jsxs("div", { style: shellStyles.main, children: [_jsxs("div", { style: shellStyles.header, children: [_jsx(motion.button, { "aria-label": isCollapsed ? 'Ouvrir le menu latéral' : 'Replier le menu latéral', onClick: () => setIsCollapsed(!isCollapsed), style: {
                                    backgroundColor: theme.colors.background.white,
                                    border: `1px solid ${theme.colors.border.medium}`,
                                    borderRadius: theme.borderRadius.md,
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    marginRight: theme.spacing.md,
                                    color: theme.colors.text.primary,
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: isCollapsed ? '☰' : '✕' }), _jsx("h1", { style: shellStyles.headerTitle, children: "Plateforme Convergence - Intelligence Civique Nationale" }), _jsx("div", { style: shellStyles.userMenu, children: isAuthenticated && user ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: shellStyles.userInfo, children: [_jsx("p", { style: shellStyles.userName, children: user.fullName }), _jsx("p", { style: shellStyles.userRole, children: user.role })] }), _jsx("button", { onClick: () => logout(), style: shellStyles.logoutButton, children: "Se d\u00E9connecter" })] })) : (_jsxs("div", { style: { display: 'flex', gap: theme.spacing.md }, children: [_jsx(Link, { to: "/login", style: {
                                                ...shellStyles.logoutButton,
                                                backgroundColor: theme.colors.primary[500],
                                                color: theme.colors.text.white,
                                                border: 'none',
                                                textDecoration: 'none',
                                            }, children: "Se connecter" }), _jsx(Link, { to: "/register", style: {
                                                ...shellStyles.logoutButton,
                                                textDecoration: 'none'
                                            }, children: "S'inscrire" })] })) })] }), _jsx("div", { style: shellStyles.content, className: "min-h-[60vh]", children: children })] })] }));
};
// France Travail inspired Dashboard
const FranceTravailDashboard = () => {
    const stats = [
        { name: 'Institutions gouvernementales', value: '6', color: theme.colors.primary[500], icon: '🏛️' },
        { name: 'Documents légaux', value: '2,847', color: theme.colors.secondary[500], icon: '⚖️' },
        { name: 'Avis citoyens', value: '1,234', color: theme.colors.primary[600], icon: '💬' },
        { name: 'Requêtes IA', value: '567', color: theme.colors.secondary[600], icon: '🤖' }
    ];
    const quickActions = [
        { title: 'Institutions gouvernementales', description: 'Parcourir l\'annuaire gouvernemental', href: '/institutions', color: theme.colors.primary[500], icon: '🏛️' },
        { title: 'Hiérarchie gouvernementale', description: 'Explorer la structure administrative', href: '/hierarchy', color: theme.colors.secondary[500], icon: '👑' },
        { title: 'Documents légaux', description: 'Rechercher lois et réglementations', href: '/legal', color: theme.colors.primary[600], icon: '⚖️' },
        { title: 'Assistant IA juridique', description: 'Poser des questions juridiques', href: '/ai', color: theme.colors.secondary[600], icon: '🤖' },
        { title: 'Avis citoyens', description: 'Évaluer fonctionnaires et services', href: '/reviews', color: theme.colors.primary[700], icon: '💬' },
        { title: 'Transparence budgétaire', description: 'Explorer les données budgétaires', href: '/budget', color: theme.colors.secondary[700], icon: '📊' },
    ];
    return (_jsxs("div", { style: { maxWidth: '1200px', margin: '0 auto', padding: theme.spacing.lg }, children: [_jsxs("div", { style: {
                    backgroundColor: theme.colors.background.white,
                    border: `1px solid ${theme.colors.border.light}`,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing['2xl'],
                    marginBottom: theme.spacing.xl,
                    textAlign: 'center',
                    boxShadow: theme.shadows.sm
                }, children: [_jsx("h1", { style: {
                            fontSize: theme.typography.sizes['3xl'],
                            fontWeight: theme.typography.weights.bold,
                            color: theme.colors.text.primary,
                            margin: '0 0 16px 0'
                        }, children: "Bienvenue sur Convergence" }), _jsx("p", { style: {
                            fontSize: theme.typography.sizes.lg,
                            color: theme.colors.text.secondary,
                            margin: '0 0 24px 0',
                            lineHeight: 1.6
                        }, children: "Votre plateforme d'intelligence civique pour une gouvernance transparente et participative" }), _jsxs("div", { style: {
                            display: 'flex',
                            justifyContent: 'center',
                            gap: theme.spacing.md,
                            flexWrap: 'wrap'
                        }, children: [_jsx("div", { style: {
                                    backgroundColor: theme.colors.primary[50],
                                    color: theme.colors.primary[700],
                                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.sizes.sm,
                                    fontWeight: theme.typography.weights.medium
                                }, children: "\uD83C\uDDF2\uD83C\uDDE6 Gouvernance marocaine" }), _jsx("div", { style: {
                                    backgroundColor: theme.colors.secondary[50],
                                    color: theme.colors.secondary[700],
                                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                    borderRadius: theme.borderRadius.md,
                                    fontSize: theme.typography.sizes.sm,
                                    fontWeight: theme.typography.weights.medium
                                }, children: "\u2696\uFE0F Transparence l\u00E9gale" })] })] }), _jsx("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: theme.spacing.lg,
                    marginBottom: theme.spacing.xl
                }, children: stats.map((stat, index) => (_jsxs("div", { style: {
                        backgroundColor: theme.colors.background.white,
                        border: `1px solid ${theme.colors.border.light}`,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.xl,
                        textAlign: 'center',
                        boxShadow: theme.shadows.sm,
                        transition: theme.transitions.fast
                    }, children: [_jsx("div", { style: { fontSize: '32px', marginBottom: theme.spacing.md }, children: stat.icon }), _jsx("div", { style: {
                                fontSize: theme.typography.sizes['2xl'],
                                fontWeight: theme.typography.weights.bold,
                                color: stat.color,
                                margin: '0 0 8px 0'
                            }, children: _jsx(AnimatedCounter, { value: parseInt(stat.value.replace(',', '')) }) }), _jsx("div", { style: {
                                fontSize: theme.typography.sizes.sm,
                                color: theme.colors.text.secondary,
                                margin: 0
                            }, children: stat.name })] }, index))) }), _jsxs("div", { children: [_jsx("h2", { style: {
                            fontSize: theme.typography.sizes.xl,
                            fontWeight: theme.typography.weights.semibold,
                            color: theme.colors.text.primary,
                            margin: '0 0 24px 0'
                        }, children: "Acc\u00E8s rapide" }), _jsx("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: theme.spacing.lg
                        }, children: quickActions.map((action, index) => (_jsxs(Link, { to: action.href, style: {
                                backgroundColor: theme.colors.background.white,
                                border: `1px solid ${theme.colors.border.light}`,
                                borderRadius: theme.borderRadius.lg,
                                padding: theme.spacing.xl,
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'block',
                                transition: theme.transitions.fast,
                                boxShadow: theme.shadows.sm
                            }, onMouseEnter: (e) => {
                                e.currentTarget.style.boxShadow = theme.shadows.md;
                                e.currentTarget.style.borderColor = action.color;
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.boxShadow = theme.shadows.sm;
                                e.currentTarget.style.borderColor = theme.colors.border.light;
                            }, children: [_jsxs("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: theme.spacing.md,
                                        marginBottom: theme.spacing.sm
                                    }, children: [_jsx("div", { style: {
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: action.color,
                                                borderRadius: theme.borderRadius.md,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '20px'
                                            }, children: action.icon }), _jsx("h3", { style: {
                                                fontSize: theme.typography.sizes.lg,
                                                fontWeight: theme.typography.weights.semibold,
                                                color: theme.colors.text.primary,
                                                margin: 0
                                            }, children: action.title })] }), _jsx("p", { style: {
                                        fontSize: theme.typography.sizes.sm,
                                        color: theme.colors.text.secondary,
                                        margin: 0,
                                        lineHeight: 1.5
                                    }, children: action.description })] }, index))) })] })] }));
};
// Main App Component
const App = () => {
    const { isAuthenticated } = useAuthStore();
    const [dir, setDir] = useState('ltr');
    useEffect(() => {
        // Set RTL for Arabic
        const language = i18next.language;
        setDir(language === 'ar' ? 'rtl' : 'ltr');
    }, []);
    // Check if user is authenticated from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to validate the token here
            // For now, we'll just check if the store already has the user
            const { user, isAuthenticated } = useAuthStore.getState();
            if (!isAuthenticated && user) {
                useAuthStore.getState().login(token, user);
            }
        }
    }, []);
    return (_jsx("div", { dir: dir, children: _jsx(BrowserRouter, { children: _jsx(FranceTravailShell, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(FranceTravailDashboard, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/institutions", element: _jsx(InstitutionsPage, {}) }), _jsx(Route, { path: "/hierarchy", element: _jsx(GovernmentHierarchy, {}) }), _jsx(Route, { path: "/legal", element: _jsx(LegalRepository, {}) }), _jsx(Route, { path: "/ai", element: _jsx(AILegalQA, {}) }), _jsx(Route, { path: "/reviews", element: _jsx(CitizenReviews, {}) }), _jsx(Route, { path: "/budget", element: _jsx(BudgetDashboard, {}) })] }) }) }) }));
};
export default App;
