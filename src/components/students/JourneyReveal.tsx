'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Keep server-rendered content visible; animate once as each section enters view. */
export default function JourneyReveal({ children, className, delay = 0, from = 'below' }: {
    children: ReactNode;
    className?: string;
    delay?: number;
    /** 'right' glides content in from the right edge, travelling right-to-left. */
    from?: 'below' | 'right';
}) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={false}
            whileInView={reducedMotion ? undefined : from === 'right'
                ? { opacity: [0, 1], x: [56, 0], filter: ['blur(4px)', 'blur(0px)'] }
                : { opacity: [0.65, 1], y: [24, 0] }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: from === 'right' ? 0.9 : 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
