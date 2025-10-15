import React from 'react'
import { motion } from 'framer-motion'

export const MoroccanAnimatedBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1f2a] via-[#0e2f40] to-[#0b1f2a]" />

      {/* Subtle animated radial glows (Moroccan blue / gold) */}
      <motion.div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(0,122,204,0.25), transparent)' }}
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(218,165,32,0.18), transparent)' }}
        animate={{ x: [0, -15, 0], y: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating geometric tiles mimicking zellige motifs */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-8 w-8 rotate-45 border border-[#0ea5b1]/40"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 100}%`,
              boxShadow: '0 0 10px rgba(14,165,177,0.15)'
            }}
            animate={{ y: [0, -8, 0], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          />)
        )}
      </div>
    </div>
  )
}

export default MoroccanAnimatedBackground


