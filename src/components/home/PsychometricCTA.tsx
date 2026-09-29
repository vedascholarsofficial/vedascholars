import React from 'react';
import Button from '../ui/Button';

export default function PsychometricCTA() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background decor */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left: text */}
            <div className="p-10 md:p-14 flex-1">
              <span className="inline-block bg-secondary/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                Free Assessment
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 leading-snug">
                Discover Your{' '}
                <span className="text-secondary">Ideal Career Path</span>
                <br />in Just 4 Minutes
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed max-w-sm">
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
                  { emoji: '💻', label: 'Technical', color: 'bg-blue-900/40 border-blue-700/50' },
                  { emoji: '🏆', label: 'Management', color: 'bg-amber-900/40 border-amber-700/50' },
                  { emoji: '🎨', label: 'Creative', color: 'bg-purple-900/40 border-purple-700/50' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${item.color} text-white text-sm font-semibold`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
                <p className="text-slate-500 text-xs mt-4">3 career dimensions · 15 questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
