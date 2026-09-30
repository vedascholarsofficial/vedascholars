import React from 'react';
import Button from '../ui/Button';

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

export default function PsychometricCTA() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background decor */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="relative max-w-5xl mx-auto bg-primary bg-gradient-to-br from-[#3A1A48] via-primary to-[#170A1D] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(36,17,45,0.45)] ring-1 ring-white/5">
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center">
            {/* Left: text */}
            <div className="p-10 md:p-14 flex-1">
              <span className="inline-block bg-white/10 border border-accent/30 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                Free Assessment
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 leading-snug">
                Discover Your{' '}
                <span className="text-accent">Ideal Career Path</span>
                <br />in Just 4 Minutes
              </h2>
              <p className="text-white/75 mb-8 leading-relaxed max-w-sm">
                Take our science-backed psychometric test and get a personalised career
                recommendation — no sign-up required.
              </p>
              <Button
                variant="primary"
                size="lg"
                href="/psychometric-test"
                id="psychometric-test-cta"
                className="shadow-lg shadow-secondary/20"
              >
                Take Free Psychometric Test →
              </Button>
            </div>

            {/* Right: visual */}
            <div className="hidden md:flex items-center justify-center w-72 shrink-0 p-10">
              <div className="text-center space-y-4">
                {[
                  { icon: <TechnicalIcon />, label: 'Technical', color: 'bg-white/5 border-white/15' },
                  { icon: <ManagementIcon />, label: 'Management', color: 'bg-white/5 border-white/15' },
                  { icon: <CreativeIcon />, label: 'Creative', color: 'bg-secondary/25 border-accent/40' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${item.color} text-white text-sm font-semibold backdrop-blur-sm`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-secondary/60 to-white/5 text-[#F3DAFB] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_6px_16px_rgba(0,0,0,0.25)]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                ))}
                <p className="text-white/60 text-xs mt-4">3 career dimensions · 15 questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
