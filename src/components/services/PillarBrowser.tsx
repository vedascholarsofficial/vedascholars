'use client';

import { Children, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import styles from './PillarBrowser.module.css';

const mobileQuery = '(max-width: 767px)';
const subscribe = (notify: () => void) => {
    const media = window.matchMedia(mobileQuery);
    media.addEventListener('change', notify);
    return () => media.removeEventListener('change', notify);
};
const mobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const serverSnapshot = () => false;

function ScrollCard({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const mobile = useSyncExternalStore(subscribe, mobileSnapshot, serverSnapshot);
    const reducedMotion = useReducedMotion();
    // Measure the stationary frame, so the animation cannot alter its own progress.
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const x = useTransform(scrollYProgress, [0, 0.12, 0.22, 0.78, 0.94, 1], [48, 32, 0, 0, -36, -56]);

    return (
        <div ref={ref} className={styles.frame}>
            <motion.div
                className={styles.card}
                style={mobile && !reducedMotion ? { x } : undefined}
            >
                {children}
            </motion.div>
        </div>
    );
}

/** Native vertical scrolling drives a gentle sideways card movement on mobile. */
export default function PillarBrowser({ children }: { children: ReactNode }) {
    return (
        <div className={styles.flow} aria-label="Service pillar content">
            {Children.map(children, child => <ScrollCard>{child}</ScrollCard>)}
        </div>
    );
}
