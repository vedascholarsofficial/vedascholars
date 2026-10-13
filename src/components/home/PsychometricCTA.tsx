import React from 'react';
import * as motion from 'framer-motion/client';
import Button from '../ui/Button';
import Reveal from '../animations/Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-6 w-6',
  'aria-hidden': true,
};

/* Technical: code window */
const TechnicalIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4.5" width="18" height="15" rx="3" fill="currentColor" fillOpacity="0.14" />
    <path d="M3 9h18" />
    <circle cx="6.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="8.4" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    <path d="m9.5 12.2-2 1.8 2 1.8M14.5 12.2l2 1.8-2 1.8M12.8 11.6l-1.6 4.8" />
  </svg>
);

/* Management: growth chart with a rising arrow */
const ManagementIcon = () => (
  <svg {...iconProps}>
    <rect x="4" y="14" width="3.6" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
    <rect x="10.2" y="10.5" width="3.6" height="9.5" rx="1" fill="currentColor" fillOpacity="0.2" />
    <rect x="16.4" y="7" width="3.6" height="13" rx="1" fill="currentColor" fillOpacity="0.2" />
    <path d="M4 9.5 9 5.5l3.2 2.4L19.5 3M15.5 3h4v4" />
  </svg>
);

/* Creative: pen nib with a spark */
const CreativeIcon = () => (
  <svg {...iconProps}>
    <path d="M11 4.5 16.5 11 11 20.5 5.5 11z" fill="currentColor" fillOpacity="0.18" />
    <circle cx="11" cy="10.6" r="1.4" />
    <path d="M11 12v8.5" />
    <path d="M19 3v3.6M17.2 4.8h3.6" />
  </svg>
);

const DIMENSIONS = [
  { icon: <TechnicalIcon />, label: 'Technical', color: 'bg-white/5 border-white/15' },
  { icon: <ManagementIcon />, label: 'Management', color: 'bg-white/5 border-white/15' },
  { icon: <CreativeIcon />, label: 'Creative', color: 'bg-secondary/25 border-accent/40' },
];

export default function PsychometricCTA() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Subtle background decor */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal variant="scale" duration={1}>
          <div className="relative max-w-5xl mx-auto bg-primary bg-gradient-to-br from-[#3A1A48] via-primary to-[#170A1D] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(36,17,45,0.45)] ring-1 ring-white/5">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-float-slow" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
            <div className="relative flex flex-col md:flex-row items-center">
              {/* Left: text */}
              <div className="p-7 sm:p-10 md:p-14 flex-1">
                <Reveal delay={0.15}>
                  <span className="inline-block bg-white/10 border border-accent/30 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                    Free Interest Check
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-snug tracking-tight">
                    Discover Your{' '}
                    <span className="text-accent">Ideal Career Path</span>
                    <br />in Just 4 Minutes
                  </h2>
                </Reveal>
                <Reveal delay={0.25}>
                  <p className="text-white/75 mb-6 md:mb-8 leading-relaxed max-w-sm">
                    Answer 15 quick questions to see which career areas may suit your interests.
                    It is a starting point for a conversation, not a formal assessment. No sign-up required.
                  </p>
                </Reveal>

                {/* Mobile: the three dimensions as a compact chip row */}
                <div className="md:hidden flex flex-wrap gap-2 mb-7" aria-hidden="true">
                  {DIMENSIONS.map((item) => (
                    <span key={item.label} className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border ${item.color} text-white text-xs font-semibold`}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-secondary/60 to-white/5 text-[#F3DAFB] [&>svg]:h-4 [&>svg]:w-4">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                  ))}
                </div>

                <Reveal delay={0.35}>
                  <Button
                    variant="primary"
                    size="lg"
                    href="/psychometric-test"
                    id="psychometric-test-cta"
                    className="w-full sm:w-auto rounded-full shadow-lg shadow-secondary/20 hover:shadow-[0_18px_44px_rgba(139,43,180,0.55)]"
                  >
                    Take the Free Interest Check →
                  </Button>
                </Reveal>
              </div>

              {/* Right: visual */}
              <div className="hidden md:flex items-center justify-center w-72 shrink-0 p-10">
                <div className="text-center space-y-4">
                  {DIMENSIONS.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.12, ease: EASE }}
                    >
                      <div
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${item.color} text-white text-sm font-semibold backdrop-blur-sm hover:-translate-x-1 hover:border-accent/50 transition-all duration-300`}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-secondary/60 to-white/5 text-[#F3DAFB] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_16px_rgba(0,0,0,0.25)]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </motion.div>
                  ))}
                  <p className="text-white/60 text-xs mt-4">3 career dimensions · 15 questions</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
