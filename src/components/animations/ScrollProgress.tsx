'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin brand-coloured bar along the top edge that tracks page scroll. */
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-secondary via-[#C77DE3] to-accent"
            style={{ scaleX }}
        />
    );
}
