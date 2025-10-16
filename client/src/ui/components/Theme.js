import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
// Shared Moroccan-themed UI primitives for consistent enterprise styling
export const Card = ({ children, className = '', padding = 'md', as: Tag = 'div' }) => {
    const pad = padding === 'none' ? '' : padding === 'sm' ? 'p-3' : padding === 'lg' ? 'p-6' : 'p-4';
    return (_jsx(Tag, { className: `backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_24px_rgba(0,0,0,0.15)] ${pad} ${className}`, children: children }));
};
export const GlassButton = ({ children, className = '', onClick, type = 'button', disabled = false, variant = 'primary' }) => {
    const variantCls = variant === 'primary'
        ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
        : variant === 'danger'
            ? 'bg-rose-600 hover:bg-rose-500 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white';
    return (_jsx("button", { type: type, onClick: onClick, disabled: disabled, className: `inline-flex items-center justify-center rounded-lg px-4 py-2 border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantCls} ${className}`, children: children }));
};
export const TextField = ({ value, onChange, placeholder, className = '', disabled, type = 'text' }) => (_jsx("input", { type: type, value: value, onChange: onChange, placeholder: placeholder, disabled: disabled, className: `w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:border-cyan-300/60 focus:outline-none ${className}` }));
export const SelectField = ({ value, onChange, children, className = '' }) => (_jsx("select", { value: value, onChange: onChange, className: `w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white ${className}`, children: children }));
export const TextAreaField = ({ value, onChange, placeholder, className = '', minRows = 4 }) => (_jsx("textarea", { value: value, onChange: onChange, placeholder: placeholder, rows: minRows, className: `w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:border-cyan-300/60 focus:outline-none ${className}` }));
export const SectionHeader = ({ title, subtitle, className = '' }) => (_jsxs("div", { className: `mb-6 ${className}`, children: [_jsx("h2", { className: "text-2xl font-semibold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent", children: title }), subtitle && _jsx("p", { className: "mt-1 text-white/80 text-sm", children: subtitle })] }));
export const StatCard = ({ label, value, accent = '#7dd3fc', icon }) => (_jsxs(Card, { className: "text-center", children: [_jsx("div", { className: "flex items-center justify-center mb-2", children: icon }), _jsx("div", { className: "text-4xl font-extrabold", style: { color: accent }, children: value }), _jsx("div", { className: "text-sm text-white/70 mt-1", children: label })] }));
export const PatternDivider = ({ className = '' }) => (_jsx("div", { className: `my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}` }));
export const Modal = ({ open, onClose, title, children }) => {
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/50", onClick: onClose }), _jsxs(Card, { className: "relative w-[95vw] max-w-2xl p-6", children: [title && _jsx("h3", { className: "text-xl font-semibold text-white mb-4", children: title }), children, _jsx("div", { className: "mt-6 flex justify-end", children: _jsx(GlassButton, { onClick: onClose, variant: "secondary", children: "Close" }) })] })] }));
};
export const FadeIn = ({ children, delay = 0, className = '' }) => (_jsx(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.4 }, className: className, children: children }));
export const MoroccanHeading = ({ children, className = '' }) => (_jsx("h1", { className: `text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-amber-200 bg-clip-text text-transparent ${className}`, children: children }));
export const Badge = ({ children, color = '#7dd3fc', className = '' }) => (_jsx("span", { className: `inline-block rounded-full px-3 py-1 text-xs font-medium`, style: { backgroundColor: `${color}20`, color }, children: children }));
export const Kpi = ({ value, label, color = '#7dd3fc' }) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl font-extrabold", style: { color }, children: value }), _jsx("div", { className: "text-white/70 text-sm mt-1", children: label })] }));
export const PillNavItem = ({ active, children, href }) => (_jsx("a", { href: href, className: `inline-flex items-center rounded-full px-4 py-2 border text-sm transition-all ${active ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`, children: children }));
export const Grid = ({ children, cols = 3, className = '' }) => (_jsx("div", { className: `grid gap-4 ${cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} ${className}`, children: children }));
export const InfoRow = ({ label, value }) => (_jsxs("div", { className: "flex items-start justify-between gap-3 py-2", children: [_jsx("span", { className: "text-white/70 text-sm", children: label }), _jsx("span", { className: "text-white text-sm font-medium", children: value })] }));
export const Surface = ({ children, className = '' }) => (_jsx("div", { className: `rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`, children: children }));
export const PageContainer = ({ children, className = '' }) => (_jsx("div", { className: `max-w-6xl mx-auto px-4 py-6 md:py-8 ${className}`, children: children }));
export default {
    Card,
    GlassButton,
    TextField,
    SelectField,
    TextAreaField,
    SectionHeader,
    StatCard,
    PatternDivider,
    Modal,
    FadeIn,
    MoroccanHeading,
    Badge,
    Kpi,
    PillNavItem,
    Grid,
    InfoRow,
    Surface,
    PageContainer,
};
