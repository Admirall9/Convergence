import React from 'react'
import { motion } from 'framer-motion'

// Shared Moroccan-themed UI primitives for consistent enterprise styling

export const Card: React.FC<{
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: keyof JSX.IntrinsicElements
}> = ({ children, className = '', padding = 'md', as: Tag = 'div' }) => {
  const pad = padding === 'none' ? '' : padding === 'sm' ? 'p-3' : padding === 'lg' ? 'p-6' : 'p-4'
  return (
    <Tag
      className={`backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_24px_rgba(0,0,0,0.15)] ${pad} ${className}`}
    >
      {children}
    </Tag>
  )
}

export const GlassButton: React.FC<{
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}> = ({ children, className = '', onClick, type = 'button', disabled = false, variant = 'primary' }) => {
  const variantCls =
    variant === 'primary'
      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
      : variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 text-white'
      : 'bg-white/10 hover:bg-white/20 text-white'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantCls} ${className}`}
    >
      {children}
    </button>
  )
}

export const TextField: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  type?: string
}> = ({ value, onChange, placeholder, className = '', disabled, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:border-cyan-300/60 focus:outline-none ${className}`}
  />
)

export const SelectField: React.FC<{
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
  className?: string
}> = ({ value, onChange, children, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white ${className}`}
  >
    {children}
  </select>
)

export const TextAreaField: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  minRows?: number
}> = ({ value, onChange, placeholder, className = '', minRows = 4 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={minRows}
    className={`w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:border-cyan-300/60 focus:outline-none ${className}`}
  />
)

export const SectionHeader: React.FC<{ title: string; subtitle?: string; className?: string }> = ({ title, subtitle, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{title}</h2>
    {subtitle && <p className="mt-1 text-white/80 text-sm">{subtitle}</p>}
  </div>
)

export const StatCard: React.FC<{ label: string; value: string | number; accent?: string; icon?: React.ReactNode }>= ({ label, value, accent = '#7dd3fc', icon }) => (
  <Card className="text-center">
    <div className="flex items-center justify-center mb-2">{icon}</div>
    <div className="text-4xl font-extrabold" style={{ color: accent }}>{value}</div>
    <div className="text-sm text-white/70 mt-1">{label}</div>
  </Card>
)

export const PatternDivider: React.FC<{ className?: string }>= ({ className = '' }) => (
  <div className={`my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`} />
)

export const Modal: React.FC<{ open: boolean; onClose: () => void; title?: string; children: React.ReactNode }>= ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative w-[95vw] max-w-2xl p-6">
        {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
        {children}
        <div className="mt-6 flex justify-end">
          <GlassButton onClick={onClose} variant="secondary">Close</GlassButton>
        </div>
      </Card>
    </div>
  )
}

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }>= ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }} className={className}>
    {children}
  </motion.div>
)

export const MoroccanHeading: React.FC<{ children: React.ReactNode; className?: string }>= ({ children, className = '' }) => (
  <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-amber-200 bg-clip-text text-transparent ${className}`}>{children}</h1>
)

export const Badge: React.FC<{ children: React.ReactNode; color?: string; className?: string }>= ({ children, color = '#7dd3fc', className = '' }) => (
  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium`} style={{ backgroundColor: `${color}20`, color }}>{children}</span>
)

export const Kpi: React.FC<{ value: string | number; label: string; color?: string }>= ({ value, label, color = '#7dd3fc' }) => (
  <div className="text-center">
    <div className="text-4xl font-extrabold" style={{ color }}>{value}</div>
    <div className="text-white/70 text-sm mt-1">{label}</div>
  </div>
)

export const PillNavItem: React.FC<{ active?: boolean; children: React.ReactNode; href: string }>= ({ active, children, href }) => (
  <a href={href} className={`inline-flex items-center rounded-full px-4 py-2 border text-sm transition-all ${active ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
    {children}
  </a>
)

export const Grid: React.FC<{ children: React.ReactNode; cols?: number; className?: string }>= ({ children, cols = 3, className = '' }) => (
  <div className={`grid gap-4 ${cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} ${className}`}>{children}</div>
)

export const InfoRow: React.FC<{ label: string; value: React.ReactNode }>= ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 py-2">
    <span className="text-white/70 text-sm">{label}</span>
    <span className="text-white text-sm font-medium">{value}</span>
  </div>
)

export const Surface: React.FC<{ children: React.ReactNode; className?: string }>= ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}>{children}</div>
)

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }>= ({ children, className = '' }) => (
  <div className={`max-w-6xl mx-auto px-4 py-6 md:py-8 ${className}`}>{children}</div>
)

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
}


