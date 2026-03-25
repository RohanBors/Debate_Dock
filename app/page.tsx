'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ParticleBackground from '@/components/ParticleBackground';

const TAGLINES = [
  'Seven minds. One truth.',
  'Where AI models debate.',
  'Consensus through conflict.',
  'The council has convened.',
];

export default function HomePage() {
  const [tagline, setTagline] = useState(TAGLINES[0]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % TAGLINES.length;
        setTagline(TAGLINES[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      <ParticleBackground />
      {/* Background glow */}
      <div className="absolute inset-0 bg-council-glow pointer-events-none" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, #ccff00 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border transition-all hover:border-council-accent hover:shadow-[0_0_15px_rgba(204,255,0,0.3)]"
          style={{ background: 'rgba(204,255,0,0.05)', border: '1px solid rgba(204,255,0,0.2)', color: '#ccff00' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-council-accent animate-pulse-slow inline-block" />
          Open Source · Powered by OpenRouter
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4"
          style={{ background: 'linear-gradient(135deg, #ffffff 30%, #ccff00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(204,255,0,0.2)' }}>
          LLM Council
        </h1>

        {/* Rotating tagline */}
        <p key={tagline} className="text-xl text-council-muted mb-12 h-8 animate-fade-in font-light">
          {tagline}
        </p>

        {/* Description */}
        <p className="text-council-text/70 max-w-xl mx-auto mb-12 leading-relaxed text-lg">
          Assemble up to <span className="text-council-accent font-semibold tracking-wide">7 AI models</span> as a council. Assign each a{' '}
          <span className="text-white font-semibold">persona</span>. Run structured{' '}
          <span className="text-white font-semibold">3-round debates</span>. Let the{' '}
          <span className="text-council-accent font-semibold tracking-wide">Chairman</span> synthesize the truth.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/settings"
            className="px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: '#ccff00',
              color: '#000000',
              boxShadow: '0 0 25px rgba(204,255,0,0.3)',
            }}
          >
            Assemble Your Council →
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e8e8f0',
            }}
          >
            ★ GitHub
          </a>
        </div>

        {/* Round flow preview */}
        <div className="mt-20 grid grid-cols-3 gap-4 text-left">
          {[
            { round: 'Round 1', label: 'Opening Statements', desc: 'Each councillor speaks independently', icon: '🎙️' },
            { round: 'Round 2', label: 'Rebuttals', desc: 'Models read each other and respond', icon: '⚔️' },
            { round: 'Round 3', label: 'Chairman Synthesis', desc: 'Final verdict distilled from all voices', icon: '👑' },
          ].map((r) => (
            <div key={r.round} className="council-card p-5 hover:border-council-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(204,255,0,0.1)] hover:-translate-y-1">
              <div className="text-2xl mb-3">{r.icon}</div>
              <div className="text-xs font-bold text-council-accent uppercase tracking-widest mb-1.5">{r.round}</div>
              <div className="text-sm font-semibold text-white mb-2">{r.label}</div>
              <div className="text-xs text-council-muted leading-relaxed">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
