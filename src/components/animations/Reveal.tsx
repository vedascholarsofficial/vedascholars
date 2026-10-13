'use client';

import React from 'react';
import { motion, MotionConfig, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

type Variant = 'up' | 'left' | 'right' | 'scale' | 'mask' | 'line';

const variants: Record<Variant, Variants> = {
    up: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } },
    mask: {
        hidden: { opacity: 0, clipPath: 'inset(12% 12% 12% 12% round 24px)' },
        visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 24px)' },
    },
    line: { hidden: { scaleX: 0 }, visible: { scaleX: 1 } },
};

interface RevealProps {
    children?: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    variant?: Variant;
}

/** Animates its children into view once, when scrolled to. */
export default function Reveal({ children, className, delay = 0, duration = 0.8, variant = 'up' }: RevealProps) {
    return (
        <motion.div
            className={className}
            style={variant === 'line' ? { transformOrigin: 'left' } : undefined}
            variants={variants[variant]}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/** Slow zoom-out on an image as it scrolls into view. */
export function ZoomImage({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial={{ scale: 1.12 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.6, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/** Honors the visitor's reduced-motion setting for every animation below it. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
