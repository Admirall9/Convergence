import React, { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

export const AnimatedCounter: React.FC<{ value: string | number, color?: string }> = ({ value, color }) => {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, latest => Math.floor(latest).toLocaleString())

  useEffect(() => {
    const v = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) || 0 : value
    const controls = animate(mv, v, { duration: 0.8, ease: 'easeOut' })
    return controls.stop
  }, [value])

  return (
    <motion.div style={{ fontSize: '32px', fontWeight: 800, color }}>
      {rounded}
    </motion.div>
  )
}

export default AnimatedCounter


