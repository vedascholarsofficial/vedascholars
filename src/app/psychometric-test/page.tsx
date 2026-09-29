'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { psychometricQuestions, careerResults } from '@/data/psychometricQuestions';

// ─── Types ───────────────────────────────────────────────────────────────────
type Category = 'technical' | 'management' | 'creative';
type Scores = Record<Category, number>;
type Phase = 'intro' | 'test' | 'result';

// ─── Metadata ────────────────────────────────────────────────────────────────
// (exported separately for server components, but page is client)
const totalQuestions = psychometricQuestions.length;

// ─── Component ───────────────────────────────────────────────────────────────
export default function PsychometricTestPage() {
  const { isAuthenticated, user } = useAuth();

  // Phase: intro → test → result
  const [phase, setPhase] = useState<Phase>('intro');

  // Current question index (0-based)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scores per category
  const [scores, setScores] = useState<Scores>({ technical: 0, management: 0, creative: 0 });

  // Selected option for highlight feedback
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Result
  const [resultCategory, setResultCategory] = useState<Category | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleStart = () => setPhase('test');

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return; // prevent double-click
    setSelectedOption(optionIndex);

    const question = psychometricQuestions[currentIndex];
    const option = question.options[optionIndex];
    const cat = question.category as Category;

    const newScores = { ...scores, [cat]: scores[cat] + option.score };

    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setScores(newScores);
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        // Calculate result
        setScores(newScores);
        const winner = (Object.keys(newScores) as Category[]).reduce((a, b) =>
          newScores[a] >= newScores[b] ? a : b
        );
        setResultCategory(winner);
        setPhase('result');
      }
    }, 450);
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setScores({ technical: 0, management: 0, creative: 0 });
    setSelectedOption(null);
    setResultCategory(null);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const progress = ((currentIndex) / totalQuestions) * 100;
  const question = psychometricQuestions[currentIndex];
  const result = resultCategory ? careerResults[resultCategory] : null;

  // Score percentages for display
  const totalScoreMax = 5 * 5; // 5 questions × max 5 score per category
  const technicalPct = Math.round((scores.technical / totalScoreMax) * 100);
  const managementPct = Math.round((scores.management / totalScoreMax) * 100);
  const creativePct = Math.round((scores.creative / totalScoreMax) * 100);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO BANNER ── */}
      <div className="bg-primary relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <span className="inline-block bg-secondary/20 text-secondary text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Free Career Assessment
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight mb-4">
            Discover Your{' '}
            <span className="text-secondary">Career Path</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Answer 15 science-backed questions to find out whether you are naturally suited for
            Engineering, Business Leadership, or Creative fields.
          </p>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="container mx-auto max-w-3xl px-4 py-12">

        {/* ══════════════════ INTRO PHASE ══════════════════ */}
        {phase === 'intro' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
              Ready to find your ideal career?
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
              This free psychometric assessment contains <strong>15 questions</strong> across three
              dimensions — Technical aptitude, Management aptitude, and Creative aptitude — and takes
              about <strong>3–4 minutes</strong> to complete. No sign-up required.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {[
                { label: '💻 Technical', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                { label: '🏆 Management', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { label: '🎨 Creative', color: 'bg-purple-50 text-purple-700 border-purple-200' },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${pill.color}`}
                >
                  {pill.label}
                </span>
              ))}
            </div>

            <Button variant="primary" size="lg" onClick={handleStart} className="min-w-[220px]">
              Start the Test →
            </Button>
          </div>
        )}

        {/* ══════════════════ TEST PHASE ══════════════════ */}
        {phase === 'test' && (
          <div>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-500 mb-2 font-medium">
                <span>Question {currentIndex + 1} of {totalQuestions}</span>
                <span className="capitalize text-secondary font-semibold">
                  {question.category === 'technical' ? '💻 Technical' :
                    question.category === 'management' ? '🏆 Management' : '🎨 Creative'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div
                  className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 md:p-10">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-primary mb-8 leading-snug">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      id={`option-${currentIndex}-${idx}`}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedOption !== null}
                      className={`
                        w-full text-left px-6 py-4 rounded-xl border-2 font-medium
                        transition-all duration-200 focus:outline-none
                        ${isSelected
                          ? 'border-secondary bg-secondary/10 text-primary scale-[1.01]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-secondary/60 hover:bg-slate-50 active:scale-[0.99]'
                        }
                        ${selectedOption !== null && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold
                            ${isSelected ? 'border-secondary bg-secondary text-primary' : 'border-slate-300 text-slate-400'}
                          `}
                        >
                          {isSelected ? '✓' : String.fromCharCode(65 + idx)}
                        </span>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ RESULT PHASE ══════════════════ */}
        {phase === 'result' && result && resultCategory && (
          <div>
            {/* Result card */}
            <div className="bg-primary rounded-2xl shadow-xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="text-6xl mb-4">{result.emoji}</div>
                <p className="text-secondary text-sm font-semibold uppercase tracking-widest mb-2">
                  Your Career Match
                </p>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  {result.title}
                </h2>
                <p className="text-secondary font-medium text-lg mb-6">{result.tagline}</p>
                <p className="text-slate-300 max-w-xl mx-auto leading-relaxed">
                  {result.description}
                </p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-lg font-heading font-bold text-primary mb-6">
                Your Score Breakdown
              </h3>
              <div className="space-y-5">
                {[
                  { label: '💻 Technical', pct: technicalPct, cat: 'technical' },
                  { label: '🏆 Management', pct: managementPct, cat: 'management' },
                  { label: '🎨 Creative', pct: creativePct, cat: 'creative' },
                ].map(({ label, pct, cat }) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span className={resultCategory === cat ? 'text-primary font-bold' : 'text-slate-600'}>
                        {label} {resultCategory === cat && '★ Best Match'}
                      </span>
                      <span className={resultCategory === cat ? 'text-secondary font-bold' : 'text-slate-400'}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${resultCategory === cat ? 'bg-secondary' : 'bg-slate-300'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested careers */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-lg font-heading font-bold text-primary mb-6">
                Suggested Career Paths for You
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.careers.map((career, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                    <span className="text-slate-700 font-medium text-sm">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── LOGIN CTA (unauthenticated users) ── */}
            {!isAuthenticated && (
              <div className="bg-slate-900 rounded-2xl p-8 text-center mb-8">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  Save Your Result
                </h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Create a free account to save your psychometric result, track your progress, and
                  get personalised career counselling from our experts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="primary" size="md" href="/register">
                    Create Free Account
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    href="/login"
                    className="border-slate-500 text-slate-300 hover:bg-slate-800 hover:border-slate-400"
                  >
                    Login to Save
                  </Button>
                </div>
              </div>
            )}

            {/* ── COUNSELLING CTA ── */}
            <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-8 text-center mb-8">
              <h3 className="text-lg font-heading font-bold text-primary mb-2">
                Want Expert Guidance?
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm">
                Our Veda Scholars career counsellors can help you create a personalised roadmap
                based on your result.
              </p>
              <Button variant="primary" size="md" href="/contact?type=student">
                Book Free Counselling
              </Button>
            </div>

            {/* Retake / Go Home */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="md" onClick={handleRetake}>
                ↺ Retake the Test
              </Button>
              <Button variant="outline" size="md" href="/" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                ← Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
