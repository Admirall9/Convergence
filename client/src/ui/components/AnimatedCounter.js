import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
export const AnimatedCounter = ({ value, color }) => {
    const mv = useMotionValue(0);
    const rounded = useTransform(mv, latest => Math.floor(latest).toLocaleString());
    useEffect(() => {
        const v = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) || 0 : value;
        const controls = animate(mv, v, { duration: 0.8, ease: 'easeOut' });
        return controls.stop;
    }, [value]);
    return (_jsx(motion.div, { style: { fontSize: '32px', fontWeight: 800, color }, children: rounded }));
};
export default AnimatedCounter;
