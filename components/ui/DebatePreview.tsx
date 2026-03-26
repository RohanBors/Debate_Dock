'use client';

import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type DebateItem =
  | { type: 'question';         content: string }
  | { type: 'header';           content: string }
  | { type: 'message';          persona: string; role: string; content: string; color: string }
  | { type: 'chairman-loading' }
  | { type: 'chairman-verdict'; content: string };

// ── Static debate script ──────────────────────────────────────────────────────
const DEBATE: DebateItem[] = [
  { type: 'question', content: '"Is the world heading towards a recession?"' },
  { type: 'header', content: 'Round 1 — Opening Statements' },
  { type: 'message', persona: 'GPT-5.4', role: 'Analyst',  content: 'Data suggests a manufacturing contraction, yet consumer spending remains remarkably resilient...', color: '#60a5fa' },
  { type: 'message', persona: 'Opus-4.6', role: 'Futurist', content: 'No — AI-driven productivity gains are creating a structural economic buffer not captured in legacy metrics...', color: '#c084fc' },
  { type: 'message', persona: 'Gemini-3.1', role: 'Skeptic', content: 'The situation is far more nuanced than either position allows for. Regional divergence is the real story...', color: '#34d399' },
  { type: 'header', content: 'Round 2 — Rebuttals' },
  { type: 'message', persona: 'GPT-5.4', role: 'Analyst',  content: "Opus-4.6's productivity thesis doesn't offset the debt service burden emerging markets now face...", color: '#60a5fa' },
  { type: 'message', persona: 'Opus-4.6', role: 'Futurist', content: "Gemini-3.1's nuance misses the structural capital reallocation happening in real-time...", color: '#c084fc' },
  { type: 'message', persona: 'Gemini-3.1', role: 'Skeptic', content: "I agree with Opus-4.6 on capital flows — but the timeline presented is premature by at least 2 quarters...", color: '#34d399' },
  { type: 'header', content: 'Round 3 — Chairman Synthesis' },
  { type: 'chairman-loading' },
  { type: 'chairman-verdict', content: 'A targeted correction is probable — not a full recession. Watch Q3 credit spreads and EM debt rollovers.' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getItemText = (item: DebateItem): string => {
  if (item.type === 'question' || item.type === 'chairman-verdict') return item.content;
  if (item.type === 'message') return item.content;
  return '';
};

const getItemDelay = (item: DebateItem): number => {
  if (item.type === 'chairman-loading') return 2400;
  if (item.type === 'header')           return 350;
  if (item.type === 'question')         return 600;
  return 420;
};

const TYPING_SPEED = 16;   // ms per character
const LOOP_PAUSE   = 3200; // ms before restarting

// ── Component ─────────────────────────────────────────────────────────────────
export default function DebatePreview() {
  const [revealedCount, setRevealedCount] = useState(0);
  const [typedText,     setTypedText]     = useState('');

  useEffect(() => {
    // ── Not started yet ──────────────────────────────────────────────────────
    if (revealedCount === 0) {
      const t = setTimeout(() => { setRevealedCount(1); setTypedText(''); }, 900);
      return () => clearTimeout(t);
    }

    const currentItem = DEBATE[revealedCount - 1];
    const fullText    = getItemText(currentItem);

    // ── Still typing current item ────────────────────────────────────────────
    if (fullText && typedText.length < fullText.length) {
      const t = setTimeout(
        () => setTypedText(fullText.slice(0, typedText.length + 1)),
        TYPING_SPEED,
      );
      return () => clearTimeout(t);
    }

    // ── Finished last item → loop ────────────────────────────────────────────
    if (revealedCount >= DEBATE.length) {
      const t = setTimeout(() => { setRevealedCount(0); setTypedText(''); }, LOOP_PAUSE);
      return () => clearTimeout(t);
    }

    // ── Advance to next item ─────────────────────────────────────────────────
    const t = setTimeout(() => {
      setRevealedCount(c => c + 1);
      setTypedText('');
    }, getItemDelay(currentItem));
    return () => clearTimeout(t);
  }, [revealedCount, typedText]);

  const visibleItems = DEBATE.slice(0, revealedCount);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#080808',
        border: '1px solid rgba(204,255,0,0.12)',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
      }}
    >
      {/* ── Window bar ── */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#0d0d0d',
        }}
      >
        <span
          style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#ccff00',
            boxShadow: '0 0 8px rgba(204,255,0,0.7)',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Live Debate Preview
        </span>
      </div>

      {/* ── Messages ── */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '360px' }}>
        {visibleItems.map((item, i) => {
          const isLast = i === visibleItems.length - 1;
          const text   = isLast ? typedText : getItemText(item);
          const full   = getItemText(item);
          const showCursor = isLast && full && text.length < full.length;

          // ── User question ──
          if (item.type === 'question') return (
            <div key={i} style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(204,255,0,0.04)', border: '1px solid rgba(204,255,0,0.12)' }}>
              <div style={{ fontSize: 9, color: '#ccff00', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>User Question</div>
              <div style={{ fontSize: 12, color: '#E5E5E5', lineHeight: 1.6 }}>
                {text}{showCursor && <span style={{ borderRight: '1.5px solid #ccff00', marginLeft: 1 }} />}
              </div>
            </div>
          );

          // ── Round header ──
          if (item.type === 'header') return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <span style={{ fontSize: 9, color: '#ccff00', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {item.content}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            </div>
          );

          // ── Model message ──
          if (item.type === 'message') return (
            <div key={i} style={{ display: 'flex', gap: 9 }}>
              <div style={{ width: 2.5, borderRadius: 2, background: item.color, flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 3, lineHeight: 1 }}>
                  <span style={{ color: item.color }}>{item.persona}</span>
                  <span style={{ color: '#3a3a3a', marginLeft: 5 }}>({item.role})</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#888', lineHeight: 1.6 }}>
                  {text}{showCursor && <span style={{ borderRight: `1.5px solid ${item.color}`, marginLeft: 1 }} />}
                </div>
              </div>
            </div>
          );

          // ── Chairman loading ──
          if (item.type === 'chairman-loading') return (
            <div key={i} style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Crown style={{ width: 13, height: 13, color: '#f59e0b', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Chairman</div>
                <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Synthesizing verdict
                  <span style={{ display: 'inline-flex', gap: 3, marginLeft: 2 }}>
                    {[0, 200, 400].map(d => (
                      <span key={d} style={{ width: 3, height: 3, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', opacity: 0.7, animation: `chairdot 1.4s ${d}ms ease-in-out infinite` }} />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          );

          // ── Chairman verdict ──
          if (item.type === 'chairman-verdict') return (
            <div key={i} style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Crown style={{ width: 10, height: 10 }} />
                Final Verdict
              </div>
              <div style={{ fontSize: 12, color: '#E5E5E5', lineHeight: 1.6 }}>
                {text}{showCursor && <span style={{ borderRight: '1.5px solid #f59e0b', marginLeft: 1 }} />}
              </div>
            </div>
          );

          return null;
        })}
      </div>

      {/* ── CSS for chairman dots ── */}
      <style>{`
        @keyframes chairdot {
          0%, 80%, 100% { transform: scaleY(1); opacity: 0.4; }
          40%            { transform: scaleY(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
