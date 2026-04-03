'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCouncilStore, Councillor } from '@/store/councilStore';
import { callModel } from '@/lib/openrouter';
import { Edit2 } from 'lucide-react';
import PersonaEditModal from '@/components/ui/PersonaEditModal';

// ─── Persona system prompts ────────────────────────────────────────────────
function buildSystemPrompt(councillor: Councillor, previousChairmanSummary: string | null): string {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const baseDefault = `You are "${councillor.persona}", a council member in a structured AI deliberation.\nToday's date is ${dateStr}. Always consider recent events, macroeconomic conditions, and news up to this exact date.`;
  const base = councillor.customSystemPrompt 
    ? `You are "${councillor.persona}".\n${councillor.customSystemPrompt}\nToday's date is ${dateStr}. Always consider recent events, macroeconomic conditions, and news up to this exact date.`
    : baseDefault;
  const context = previousChairmanSummary
    ? `\n\nThis is not the first discussion. The Chairman's synthesis from the previous round of discussion was:\n"""\n${previousChairmanSummary}\n"""\nUse this as background context when forming your views.`
    : '';
  return `${base}${context}\n\nStay fully in character. Give your genuine, substantive view — do not truncate your reasoning.`;
}

function buildChairmanPrompt(councillor: Councillor, transcript: string, previousChairmanSummary: string | null): string {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const context = previousChairmanSummary
    ? `Previous discussion summary:\n"""\n${previousChairmanSummary}\n"""\n\n`
    : '';
  const task = `Below is the full transcript of the deliberation across two rounds:\n\n${transcript}\n\nYour task:\n1. Synthesize the strongest insights from all council members.\n2. Note key points of agreement and meaningful disagreements.\n3. Provide a clear, actionable final synthesis — be as thorough as the material demands.\n4. End with a "Chairman's Verdict" — a single bold conclusion.\n\nBe authoritative, fair, and decisive.`;

  if (councillor.customSystemPrompt) {
    return `You are "${councillor.persona}".\n${councillor.customSystemPrompt}\nToday's date is ${dateStr}. ${context}${task}`;
  }
  return `You are the Chairman of this council. Today's date is ${dateStr}. ${context}${task}`;
}

// ─── Helper: build transcript string ───────────────────────────────────────
type Message = { councillorId: string; round: 1 | 2 | 3; content: string };

function buildTranscript(messages: Message[], councillors: Councillor[]): string {
  const getName = (id: string) => councillors.find((c) => c.id === id)?.persona ?? id;
  return messages
    .filter((m) => m.round === 1 || m.round === 2)
    .map((m) => `[${getName(m.councillorId)} — Round ${m.round}]\n${m.content}`)
    .join('\n\n---\n\n');
}

// ─── Sub-components ────────────────────────────────────────────────────────
function CouncillorBubble({
  councillor,
  content,
  streaming,
  roundLabel,
}: {
  councillor: Councillor;
  content: string;
  streaming?: boolean;
  roundLabel: string;
}) {
  return (
    <div className="animate-message-pop origin-bottom-left">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: councillor.color }} />
        <span className="text-xs font-semibold" style={{ color: councillor.color }}>
          {councillor.persona}
        </span>
        <span className="text-xs text-council-muted">· {roundLabel}</span>
        {streaming && (
          <div className="flex gap-[2px] ml-2 items-end h-2.5">
            <div className="w-[3px] h-full bg-council-accent animate-wave-bar" style={{ animationDelay: '0ms' }} />
            <div className="w-[3px] h-full bg-council-accent animate-wave-bar" style={{ animationDelay: '250ms' }} />
            <div className="w-[3px] h-full bg-council-accent animate-wave-bar" style={{ animationDelay: '500ms' }} />
          </div>
        )}
      </div>
      <div
        className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap"
        style={{ background: '#0d0d10', border: `1px solid ${councillor.color}33` }}
      >
        {!content && streaming ? (
          <span className="text-council-muted text-xs flex items-center gap-2">
            <span className="inline-flex gap-[3px] items-end h-3">
              <span className="w-[3px] h-full bg-council-muted animate-wave-bar rounded-full" style={{ animationDelay: '0ms' }} />
              <span className="w-[3px] h-full bg-council-muted animate-wave-bar rounded-full" style={{ animationDelay: '200ms' }} />
              <span className="w-[3px] h-full bg-council-muted animate-wave-bar rounded-full" style={{ animationDelay: '400ms' }} />
            </span>
            {councillor.persona} is thinking…
          </span>
        ) : (
          <span className="text-council-text/90">
            {content || ''}
            {streaming && <span className="cursor-blink" />}
          </span>
        )}
      </div>
    </div>
  );
}

function ChairmanPanel({ content, streaming }: { content: string; streaming?: boolean }) {
  return (
    <div
      className="rounded-2xl p-6 animate-slide-up"
      style={{
        background: 'radial-gradient(ellipse at top left, rgba(204,255,0,0.1) 0%, #000000 100%)',
        border: '1px solid rgba(204,255,0,0.3)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">👑</span>
        <span className="font-bold text-council-gold">Chairman&apos;s Synthesis</span>
        {streaming && (
          <span className="ml-2 text-xs text-council-muted animate-pulse-slow">drafting…</span>
        )}
      </div>
      <div className="text-sm text-council-text/90 leading-relaxed whitespace-pre-wrap">
        {content}
        {streaming && <span className="cursor-blink" />}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function CouncilPage() {
  const router = useRouter();
  const {
    apiKey, useWebSearch, councillors, turns, activeTurnIndex,
    addTurn, appendMessage, updateMessageContent,
    setChairmanSummary, setCompletedRounds,
    getPreviousChairmanSummary, resetSession,
  } = useCouncilStore();

  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState('');
  const [editingCouncillorId, setEditingCouncillorId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Redirect if not set up
  useEffect(() => {
    if (!apiKey || councillors.length === 0) {
      router.push('/settings');
    }
  }, [apiKey, councillors, router]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isRunning, currentStep]);

  const activeTurn = activeTurnIndex >= 0 ? turns[activeTurnIndex] : null;
  const nonChairman = councillors.filter((c) => !c.isChairman);
  const chairman = councillors.find((c) => c.isChairman)!;

  // ── Run Round 1 ──────────────────────────────────────────────────────────
  async function runRound1(turnIdx: number, userPrompt: string) {
    const prevSummary = getPreviousChairmanSummary();
    setCurrentStep('Round 1 · Opening Statements');

    for (const c of nonChairman) {
      appendMessage(turnIdx, { councillorId: c.id, round: 1, content: '', streaming: true });
      const sysPrompt = buildSystemPrompt(c, prevSummary);
      let accum = '';
      try {
        await callModel({
          apiKey,
          modelId: c.modelId,
          useWebSearch,
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: userPrompt },
          ],
          onChunk: (chunk) => {
            accum += chunk;
            updateMessageContent(turnIdx, 1, c.id, accum);
          },
        });
        updateMessageContent(turnIdx, 1, c.id, accum, true);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        updateMessageContent(turnIdx, 1, c.id, `⚠️ Error: ${msg}`, true);
      }
    }
    setCompletedRounds(turnIdx, 1);
  }

  // ── Run Round 2 ──────────────────────────────────────────────────────────
  async function runRound2(turnIdx: number, userPrompt: string) {
    const turn = turns[turnIdx];
    setCurrentStep('Round 2 · Rebuttals');

    // Build round 1 transcript — non-anonymised
    const r1Transcript = turn.messages
      .filter((m) => m.round === 1)
      .map((m) => {
        const name = councillors.find((c) => c.id === m.councillorId)?.persona ?? m.councillorId;
        return `${name} said:\n${m.content}`;
      })
      .join('\n\n---\n\n');

    for (const c of nonChairman) {
      appendMessage(turnIdx, { councillorId: c.id, round: 2, content: '', streaming: true });
      const sysPrompt = buildSystemPrompt(c, getPreviousChairmanSummary());
      let accum = '';
      try {
        await callModel({
          apiKey,
          modelId: c.modelId,
          useWebSearch,
          messages: [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: userPrompt },
            {
              role: 'assistant',
              content: turn.messages.find((m) => m.round === 1 && m.councillorId === c.id)?.content ?? '',
            },
            {
              role: 'user',
              content: `Here are the opening statements from your fellow council members:\n\n${r1Transcript}\n\nNow provide your rebuttal. Reference specific council members by name. Be direct, substantive, and stay in character.`,
            },
          ],
          onChunk: (chunk) => {
            accum += chunk;
            updateMessageContent(turnIdx, 2, c.id, accum);
          },
        });
        updateMessageContent(turnIdx, 2, c.id, accum, true);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        updateMessageContent(turnIdx, 2, c.id, `⚠️ Error: ${msg}`, true);
      }
    }
    setCompletedRounds(turnIdx, 2);
  }

  // ── Run Round 3 (Chairman) ───────────────────────────────────────────────
  async function runRound3(turnIdx: number) {
    const turn = turns[turnIdx];
    setCurrentStep('Round 3 · Chairman Synthesis');

    const transcript = buildTranscript(
      turn.messages as Message[],
      councillors
    );
    const chairmanSys = buildChairmanPrompt(chairman, transcript, getPreviousChairmanSummary());

    appendMessage(turnIdx, { councillorId: chairman.id, round: 3, content: '', streaming: true });
    let accum = '';
    try {
      await callModel({
        apiKey,
        modelId: chairman.modelId,
        useWebSearch,
        messages: [
          { role: 'system', content: chairmanSys },
          { role: 'user', content: 'Deliver your synthesis now.' },
        ],
        onChunk: (chunk) => {
          accum += chunk;
          updateMessageContent(turnIdx, 3, chairman.id, accum);
        },
      });
      updateMessageContent(turnIdx, 3, chairman.id, accum, true);
      setChairmanSummary(turnIdx, accum);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      updateMessageContent(turnIdx, 3, chairman.id, `⚠️ Error: ${msg}`, true);
    }
    setCompletedRounds(turnIdx, 3);
  }

  // ── Entry: submit a new prompt ────────────────────────────────────────────
  async function handleSubmit() {
    if (!prompt.trim() || isRunning) return;
    setError('');
    setIsRunning(true);
    const userPrompt = prompt.trim();
    setPrompt('');

    addTurn(userPrompt);
    // Wait for state to update — get index
    const turnIdx = turns.length; // before addTurn it's current length

    try {
      await runRound1(turnIdx, userPrompt);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  }

  // ── Next round button ────────────────────────────────────────────────────
  async function handleNextRound() {
    if (!activeTurn || isRunning) return;
    setIsRunning(true);
    setError('');
    const turnIdx = activeTurnIndex;

    try {
      if (activeTurn.completedRounds === 1) {
        await runRound2(turnIdx, activeTurn.userPrompt);
      } else if (activeTurn.completedRounds === 2) {
        await runRound3(turnIdx);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  const getMessagesForRound = (round: 1 | 2 | 3) =>
    (activeTurn?.messages ?? []).filter((m) => m.round === round);

  const roundLabel = (r: 1 | 2 | 3) =>
    r === 1 ? 'Opening Statement' : r === 2 ? 'Rebuttal' : 'Chairman Synthesis';

  return (
    <div className="flex h-screen relative bg-grid" style={{ background: '#000000' }}>
      {/* ── Sidebar ── */}
      <aside
        className="w-64 shrink-0 border-r flex flex-col overflow-y-auto"
        style={{ background: '#09090b', borderColor: '#22222a' }}
      >
        <div className="p-4 border-b" style={{ borderColor: '#2a2a3a' }}>
          <h1 className="font-bold text-white text-sm">Debate Dock</h1>
          <p className="text-xs text-council-muted mt-0.5">{turns.length} turn{turns.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Councillors */}
        <div className="p-3">
          <p className="text-xs text-council-muted uppercase tracking-wider mb-3 px-1">Council</p>
          {councillors.map((c) => (
            <div key={c.id} className="group flex items-center gap-2 px-2 py-2 rounded-lg mb-1 hover:bg-white/5 transition-colors">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">{c.persona}</div>
                <div className="text-xs text-council-muted truncate">{c.modelName}</div>
              </div>
              {c.isChairman && <span className="text-xs ml-auto group-hover:hidden">👑</span>}
              <button 
                onClick={() => setEditingCouncillorId(c.id)} 
                className={`ml-auto opacity-0 group-hover:opacity-100 p-1.5 hover:bg-black/40 rounded-lg transition-all text-gray-400 hover:text-white ${!c.isChairman && 'col-span-1'}`}
                title="Edit Persona"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Turn history */}
        {turns.length > 0 && (
          <div className="p-3 border-t mt-auto" style={{ borderColor: '#2a2a3a' }}>
            <p className="text-xs text-council-muted uppercase tracking-wider mb-2 px-1">History</p>
            {turns.map((t, i) => (
              <div
                key={i}
                className="px-2 py-1.5 rounded text-xs text-council-muted mb-1 truncate"
                style={{ background: i === activeTurnIndex ? 'rgba(204,255,0,0.1)' : 'transparent', color: i === activeTurnIndex ? '#ccff00' : '' }}
              >
                {t.userPrompt.slice(0, 40)}{t.userPrompt.length > 40 ? '…' : ''}
              </div>
            ))}
          </div>
        )}

        {/* Bottom actions */}
        <div className="p-3 border-t" style={{ borderColor: '#2a2a3a' }}>
          <button
            onClick={() => router.push('/settings')}
            className="w-full text-left text-xs text-council-muted hover:text-white px-2 py-1.5 rounded hover:bg-council-card transition-colors"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => { resetSession(); }}
            className="w-full text-left text-xs text-red-400/70 hover:text-red-400 px-2 py-1.5 rounded hover:bg-council-card transition-colors mt-1"
          >
            🗑 New Session
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#2a2a3a' }}>
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-semibold text-white text-sm">
                {activeTurn ? activeTurn.userPrompt.slice(0, 60) + (activeTurn.userPrompt.length > 60 ? '…' : '') : 'Council Room'}
              </h2>
              {activeTurn && (
                <p className="text-xs text-council-muted">
                  Turn {activeTurnIndex + 1} · {activeTurn.completedRounds === 0 ? 'Awaiting Round 1' : activeTurn.completedRounds === 3 ? 'Complete' : `Round ${activeTurn.completedRounds} done`}
                </p>
              )}
            </div>
            {isRunning && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-council-accent animate-pulse" />
                <span className="text-xs text-council-muted">{currentStep}</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => router.push('/settings')} 
            className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors hidden sm:block"
          >
            Back to Model Selection
          </button>
        </header>

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {!activeTurn && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold text-white mb-2">The council awaits</h3>
              <p className="text-council-muted text-sm max-w-md">
                Enter your first prompt below to begin the deliberation. Each model will give an opening statement, then rebuttals, then the Chairman will synthesize.
              </p>
            </div>
          )}

          {activeTurn && (
            <>
              {/* User prompt */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-council-accent/20 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  You
                </div>
                <div className="council-card px-4 py-3 text-sm text-council-text">{activeTurn.userPrompt}</div>
              </div>

              {/* Round 1 */}
              {getMessagesForRound(1).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: '#2a2a3a' }} />
                    <span className="text-xs font-semibold text-council-accent uppercase tracking-wider">Round 1 · Opening Statements</span>
                    <div className="h-px flex-1" style={{ background: '#2a2a3a' }} />
                  </div>
                  <div className="space-y-4">
                    {getMessagesForRound(1).map((m) => {
                      const c = councillors.find((cc) => cc.id === m.councillorId)!;
                      return <CouncillorBubble key={m.councillorId} councillor={c} content={m.content} streaming={m.streaming} roundLabel={roundLabel(1)} />;
                    })}
                  </div>
                </div>
              )}

              {/* Round 2 */}
              {getMessagesForRound(2).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: '#2a2a3a' }} />
                    <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Round 2 · Rebuttals</span>
                    <div className="h-px flex-1" style={{ background: '#2a2a3a' }} />
                  </div>
                  <div className="space-y-4">
                    {getMessagesForRound(2).map((m) => {
                      const c = councillors.find((cc) => cc.id === m.councillorId)!;
                      return <CouncillorBubble key={m.councillorId} councillor={c} content={m.content} streaming={m.streaming} roundLabel={roundLabel(2)} />;
                    })}
                  </div>
                </div>
              )}

              {/* Round 3 — Chairman */}
              {getMessagesForRound(3).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: '#2a2a3a' }} />
                    <span className="text-xs font-semibold text-council-gold uppercase tracking-wider">Round 3 · Chairman Synthesis</span>
                    <div className="h-px flex-1" style={{ background: '#2a2a3a' }} />
                  </div>
                  {getMessagesForRound(3).map((m) => (
                    <ChairmanPanel key={m.councillorId} content={m.content} streaming={m.streaming} />
                  ))}
                </div>
              )}

              {/* Next round button */}
              {!isRunning && activeTurn.completedRounds > 0 && activeTurn.completedRounds < 3 && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleNextRound}
                    className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: '#ccff00',
                      color: '#000000',
                      boxShadow: '0 0 30px rgba(204, 255, 0, 0.25)',
                    }}
                  >
                    {activeTurn.completedRounds === 1 ? '⚔️ Start Round 2 — Rebuttals' : '👑 Start Round 3 — Chairman Synthesis'}
                  </button>
                </div>
              )}

              {/* Export button when done */}
              {activeTurn.completedRounds === 3 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const text = turns.map((t, i) => {
                        const msgs = t.messages.map((m) => {
                          const name = councillors.find((c) => c.id === m.councillorId)?.persona;
                          return `### ${name} (Round ${m.round})\n\n${m.content}`;
                        }).join('\n\n---\n\n');
                        return `## Turn ${i + 1}: ${t.userPrompt}\n\n${msgs}\n\n**Chairman Summary:**\n\n${t.chairmanSummary}`;
                      }).join('\n\n====\n\n');
                      const blob = new Blob([`# LLM Council Session\n\n${text}`], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'council-session.md'; a.click();
                    }}
                    className="px-6 py-2 rounded-lg text-sm font-bold transition-all hover:shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                    style={{ background: 'rgba(204,255,0,0.05)', border: '1px solid rgba(204,255,0,0.2)', color: '#ccff00' }}
                  >
                    ↓ Export Session as Markdown
                  </button>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Prompt input */}
        <div className="px-6 py-4 border-t" style={{ borderColor: '#2a2a3a' }}>
          {activeTurn && activeTurn.completedRounds < 3 && activeTurn.completedRounds > 0 && (
            <p className="text-xs text-council-muted mb-2 text-center">
              Complete all 3 rounds before submitting your next prompt
            </p>
          )}
          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isRunning && (!activeTurn || activeTurn.completedRounds === 3)) handleSubmit();
                }
              }}
              placeholder={
                isRunning
                  ? 'Council is deliberating…'
                  : activeTurn && activeTurn.completedRounds < 3 && activeTurn.completedRounds > 0
                  ? 'Finish current rounds first…'
                  : 'Ask the council anything… (Enter to submit)'
              }
              disabled={isRunning || (!!activeTurn && activeTurn.completedRounds > 0 && activeTurn.completedRounds < 3)}
              rows={2}
              className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-council-muted resize-none focus:outline-none focus:ring-2 focus:ring-council-accent disabled:opacity-40"
              style={{ background: '#13131a', border: '1px solid #2a2a3a' }}
            />
            <button
              onClick={handleSubmit}
              disabled={isRunning || !prompt.trim() || (!!activeTurn && activeTurn.completedRounds > 0 && activeTurn.completedRounds < 3)}
              className="px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none delay-75"
              style={{ background: '#ccff00', color: '#000000' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <PersonaEditModal 
        isOpen={!!editingCouncillorId} 
        onClose={() => setEditingCouncillorId(null)} 
        councillor={councillors.find(c => c.id === editingCouncillorId) || null} 
      />
    </div>
  );
}
