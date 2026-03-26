'use client';

import Link from 'next/link';
import { Github, Linkedin, Users, MessageSquare, Crown } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import DebatePreview from '@/components/ui/DebatePreview';

const FEATURE_PILLS = [
  { icon: Users,         label: 'Multi-model council',      sub: 'Up to 7 models' },
  { icon: MessageSquare, label: 'Structured 3-round debate', sub: 'Opening · Rebuttal · Synthesis' },
  { icon: Crown,         label: 'Chairman synthesis',        sub: 'One decisive verdict' },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#000000] flex flex-col overflow-hidden">

      {/* ── Top-right badge ── */}
      <div className="absolute top-5 right-6 z-20">
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 999,
            background: 'rgba(204,255,0,0.05)', border: '1px solid rgba(204,255,0,0.2)',
            color: '#ccff00', fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ccff00', boxShadow: '0 0 6px #ccff00', display: 'inline-block' }} />
          Open source&nbsp;•&nbsp;Free forever&nbsp;•&nbsp;Powered by OpenRouter
        </span>
      </div>

      {/* ── Hero area ── */}
      <div className="flex-1 z-10 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-14">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ── LEFT: Hero content ── */}
            <div className="w-full lg:w-[46%] flex flex-col items-center lg:items-start text-center lg:text-left">

              {/* Title */}
              <h1
                className="mb-4 leading-none"
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: 'clamp(52px, 7vw, 76px)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                }}
              >
                <span style={{ color: '#FFFFFF' }}>Debate </span>
                <span style={{ color: '#FFFFFF', WebkitTextStroke: '1px #ccff00' } as React.CSSProperties}>
                  Dock
                </span>
              </h1>

              {/* Subheadline */}
              <p
                className="mb-5"
                style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 500, color: '#E5E5E5', lineHeight: 1.4, letterSpacing: '-0.01em' }}
              >
                Watch the best AI models debate your toughest decisions
              </p>

              {/* Description */}
              <p
                className="mb-9 max-w-sm"
                style={{ fontSize: 14, color: '#777', lineHeight: 1.7 }}
              >
                Ask a question. Multiple AI models argue across 3 rounds.
                A chairman AI delivers the final verdict.
              </p>

              {/* ── Buttons ── */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                {/* Primary */}
                <Link
                  href="/settings"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    height: 56, padding: '0 28px', borderRadius: 12,
                    background: '#ccff00', color: '#000', fontWeight: 600, fontSize: 15,
                    letterSpacing: '-0.01em', textDecoration: 'none',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = 'inset 0 -3px 10px rgba(0,0,0,0.2), inset 0 1px 4px rgba(255,255,255,0.25)';
                    el.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = 'none';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  Assemble your Council
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>

                {/* Secondary */}
                <a
                  href="https://github.com/RohanBors/Debate_Dock"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    height: 56, padding: '0 24px', borderRadius: 12,
                    background: '#000', color: '#FFF', border: '1px solid rgba(255,255,255,0.15)',
                    fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', textDecoration: 'none',
                    transition: 'border-color 0.2s, transform 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.35)';
                    el.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.15)';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  <Github className="w-4 h-4" />
                  Star on GitHub
                </a>
              </div>

              {/* ── Feature pills ── */}
              <div className="mb-9 w-full">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase', marginBottom: 12 }}>
                  Built for hard decisions
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {FEATURE_PILLS.map(({ icon: Icon, label, sub }) => (
                    <div
                      key={label}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <Icon className="w-3 h-3 shrink-0" style={{ color: '#ccff00' }} />
                      <span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#E5E5E5' }}>{label}</span>
                        <span style={{ fontSize: 10, color: '#444', marginLeft: 5 }}>{sub}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Social icons ── */}
              <div className="flex gap-3">
                {[
                  { Icon: Github,   href: 'https://github.com/RohanBors',               label: 'GitHub' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/in/roborse/',         label: 'LinkedIn' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#444', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#ccff00';
                      el.style.borderColor = 'rgba(204,255,0,0.4)';
                      el.style.boxShadow = '0 0 12px rgba(204,255,0,0.18)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = '#444';
                      el.style.borderColor = 'rgba(255,255,255,0.08)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Debate preview panel ── */}
            <div className="w-full lg:w-[54%]">
              <DebatePreview />
            </div>

          </div>
        </div>
      </div>

      {/* ── Particle background — bottom 30% only ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none overflow-hidden">
        <ParticleBackground variant="minimal" />
      </div>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 flex items-center justify-center py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span style={{ fontSize: 12, color: '#333' }}>
          Made by{' '}
          <a
            href="https://github.com/RohanBors"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ccff00'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; }}
          >
            Rohan Borse
          </a>
        </span>
      </footer>
    </main>
  );
}
