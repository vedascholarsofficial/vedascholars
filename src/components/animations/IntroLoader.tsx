'use client';

import React, { useLayoutEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';

// True once the intro has run in this tab, so client-side navigation back to
// the homepage skips it. A full reload starts fresh and plays it again.
let introPlayed = false;

const subscribe = () => () => {};

/** Whether the intro curtain is covering the page on this render. */
export function useIntroActive() {
    return useSyncExternalStore(subscribe, () => !introPlayed, () => true);
}

export default function IntroLoader() {
    const active = useIntroActive();
    const [done, setDone] = useState(false);

    // The intro belongs at the top of the page. If a reload restores the
    // visitor further down (now or a moment later), drop the curtain at once.
    useLayoutEffect(() => {
        if (!active || done) return;
        const skipIfScrolled = () => {
            if (window.scrollY <= 10) return;
            introPlayed = true;
            setDone(true);
        };
        skipIfScrolled();
        window.addEventListener('scroll', skipIfScrolled, { passive: true });
        return () => window.removeEventListener('scroll', skipIfScrolled);
    }, [active, done]);

    if (!active || done) return null;

    return (
        <div
            aria-hidden="true"
            onAnimationEnd={(e) => {
                if (e.target !== e.currentTarget) return;
                introPlayed = true;
                setDone(true);
            }}
            className="intro-curtain pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-[#0A0510]"
        >
            {/* Barely-there warmth behind the mark, plus a fine grain so the black isn't flat */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_25%_at_50%_50%,rgba(139,43,180,0.08),transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:3px_3px]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <div className="intro-mark relative flex flex-col items-center px-6">
                <Image
                    src="/images/veda-logo-light.png"
                    alt=""
                    width={1392}
                    height={196}
                    priority
                    className="intro-wipe h-8 sm:h-10 md:h-11 w-auto"
                />
                <span className="mt-6 md:mt-7 block h-px w-32 md:w-44 overflow-hidden bg-white/10">
                    <span className="intro-line block h-full w-full origin-left bg-white/60" />
                </span>
                <span className="intro-tagline mt-5 md:mt-6 text-[9px] md:text-[10px] font-medium uppercase text-white/45 whitespace-nowrap">
                    Education to Employment
                </span>
            </div>
        </div>
    );
}
