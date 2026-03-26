'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Github, ArrowDown, Zap } from 'lucide-react';
import ShaderBackground from '@/components/ui/ShaderBackground';

const TAGLINES = [
  'Seven minds. One truth.',
  'Where AI models debate.',
  'Consensus through conflict.',
  'The council has convened.',
];

const ROUNDS = [
  { num: '01', round: 'Round 1', label: 'Opening Statements', desc: 'Each councillor speaks independently — no cross-talk, no influence.' },
  { num: '02', round: 'Round 2', label: 'Rebuttals', desc: 'Models read each other and respond with named, targeted critiques.' },
  { num: '03', round: 'Round 3', label: 'Chairman Synthesis', desc: 'One final verdict distilled from all voices — clear, decisive, unified.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const fadePop = {
  hidden: { opacity: 0, scale: 0.93 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTaglineIdx(i => (i + 1) % TAGLINES.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">

      {/* ── Layer 0: WebGL Shader ── */}
      <ShaderBackground />

      {/* ── Layer 1: Vignette overlay so content stays readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 0%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* ── Layer 2: Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold mb-10 tracking-wide"
              style={{
                background: 'rgba(204,255,0,0.06)',
                border: '1px solid rgba(204,255,0,0.25)',
                color: '#ccff00',
              }}
            >
              <Zap className="w-3 h-3 fill-[#ccff00]" />
              Open Source · Powered by OpenRouter
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none mb-6"
            style={{
              background: 'linear-gradient(140deg, #ffffff 20%, #ccff00 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Debate Dock
          </motion.h1>

          {/* Rotating tagline */}
          <motion.div variants={fadeUp} className="h-9 mb-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-xl text-[#8b8b99] font-light"
              >
                {TAGLINES[taglineIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-white/60 text-lg leading-relaxed max-w-2xl mb-12"
          >
            Assemble up to{' '}
            <span className="text-[#ccff00] font-semibold">7 AI models</span> as a council.
            Assign each a <span className="text-white font-semibold">persona</span>.
            Run structured <span className="text-white font-semibold">3-round debates</span>.
            Let the <span className="text-[#ccff00] font-semibold">Chairman</span> synthesize the truth.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-24">
            <Link href="/settings">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base cursor-pointer"
                style={{
                  background: '#ccff00',
                  color: '#000000',
                  boxShadow: '0 0 30px rgba(204,255,0,0.35)',
                }}
              >
                Open your Dock
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>

            <motion.a
              href="https://github.com/RohanBors/Debate_Dock"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#e8e8f0',
              }}
            >
              <Github className="w-4 h-4" />
              GitHub
            </motion.a>
          </motion.div>

          {/* Round cards */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left"
          >
            {ROUNDS.map((r) => (
              <motion.div
                key={r.round}
                variants={fadePop}
                whileHover={{ y: -4, boxShadow: '0 0 30px rgba(204,255,0,0.12)' }}
                className="p-5 rounded-xl cursor-default"
                style={{
                  background: 'rgba(17,17,21,0.8)',
                  border: '1px solid rgba(34,34,42,0.9)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="text-xs font-black tracking-widest mb-3"
                  style={{ color: '#ccff00', fontFamily: 'var(--font-sora)' }}
                >
                  {r.num}
                </div>
                <div className="text-xs font-bold text-[#ccff00] uppercase tracking-widest mb-1.5">
                  {r.round}
                </div>
                <div className="text-sm font-semibold text-white mb-2">{r.label}</div>
                <div className="text-xs text-[#8b8b99] leading-relaxed">{r.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 1.8, duration: 0.6 },
          y: { delay: 2.2, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="w-5 h-5 text-[#44444f]" />
      </motion.div>
    </main>
  );
}
