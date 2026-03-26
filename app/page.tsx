'use client';

import Link from 'next/link';
import { Github, Linkedin, Users, MessageSquare, Crown } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

const FEATURE_PILLS = [
  { icon: Users,       label: 'Multi-model council',       sub: 'Up to 7 models' },
  { icon: MessageSquare, label: 'Structured 3-round debate', sub: 'Opening · Rebuttal · Synthesis' },
  { icon: Crown,       label: 'Chairman synthesis',        sub: 'One decisive verdict' },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#000000] flex flex-col overflow-hidden">

      {/* ── Top-right badge ── */}
      <div className="absolute top-5 right-6 z-20">
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            background: 'rgba(204,255,0,0.05)',
            border: '1px solid rgba(204,255,0,0.2)',
            color: '#ccff00',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#ccff00', boxShadow: '0 0 6px #ccff00' }}
          />
          Open source&nbsp;•&nbsp;Free forever&nbsp;•&nbsp;Powered by OpenRouter
        </span>
      </div>

      {/* ── Hero — vertically centred ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 pt-20 pb-16">

        {/* Title */}
        <h1
          className="mb-4 leading-none"
          style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: 'clamp(64px, 9vw, 80px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
          }}
        >
          {/* "Debate" — pure white, no stroke */}
          <span style={{ color: '#FFFFFF' }}>Debate </span>
          {/* "Dock" — white fill + 1px lime stroke */}
          <span
            style={{
              color: '#FFFFFF',
              WebkitTextStroke: '1px #ccff00',
            } as React.CSSProperties}
          >
            Dock
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="mb-5"
          style={{
            fontSize: '22px',
            fontWeight: 500,
            color: '#E5E5E5',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
          }}
        >
          7 AI minds. One decisive truth.
        </p>

        {/* Short description */}
        <p
          className="mb-10 max-w-md"
          style={{
            fontSize: '15px',
            color: '#888',
            lineHeight: 1.6,
          }}
        >
          Assemble your council.<br />
          Run 3-round structured debates. Let the Chairman deliver the final verdict.
        </p>

        {/* ── Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-16">

          {/* Primary CTA */}
          <Link
            href="/settings"
            className="primary-btn group"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '56px',
              padding: '0 32px',
              borderRadius: '12px',
              background: '#ccff00',
              color: '#000000',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 -3px 10px rgba(0,0,0,0.2), inset 0 1px 4px rgba(255,255,255,0.25)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Open your Dock
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>

          {/* Secondary CTA — Star on GitHub */}
          <a
            href="https://github.com/RohanBors/Debate_Dock"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '56px',
              padding: '0 28px',
              borderRadius: '12px',
              background: '#000',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.15)',
              fontWeight: 600,
              fontSize: '15px',
              letterSpacing: '-0.01em',
              textDecoration: 'none',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <Github className="w-4 h-4" />
            Star on GitHub
          </a>
        </div>

        {/* ── Feature pills ── */}
        <div className="mb-6">
          <p
            className="mb-4"
            style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: '#555', textTransform: 'uppercase' }}
          >
            Built for hard decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {FEATURE_PILLS.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: '#ccff00' }} />
                <span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#E5E5E5' }}>{label}</span>
                  <span style={{ fontSize: '11px', color: '#555', marginLeft: '6px' }}>{sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Social icons ── */}
        <div className="flex gap-4 mt-6">
          {[
            { Icon: Github,   href: 'https://github.com/RohanBors',            label: 'GitHub' },
            { Icon: Linkedin, href: 'https://www.linkedin.com/in/roborse/',     label: 'LinkedIn' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#555',
                transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#ccff00';
                el.style.borderColor = 'rgba(204,255,0,0.4)';
                el.style.boxShadow = '0 0 14px rgba(204,255,0,0.2)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#555';
                el.style.borderColor = 'rgba(255,255,255,0.1)';
                el.style.boxShadow = 'none';
              }}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      {/* ── Subtle particle — bottom 30% only ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none overflow-hidden">
        <ParticleBackground variant="minimal" />
      </div>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 flex items-center justify-center py-4 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span style={{ fontSize: '12px', color: '#444' }}>
          Made by{' '}
          <a
            href="https://github.com/RohanBors"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#666', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ccff00'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#666'; }}
          >
            Rohan Borse
          </a>
        </span>
      </footer>
    </main>
  );
}
