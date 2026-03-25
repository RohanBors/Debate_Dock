'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCouncilStore, Councillor, COLOURS } from '@/store/councilStore';
import { fetchModels, OpenRouterModel } from '@/lib/openrouter';

const DEFAULT_PERSONAS = [
  'The Analyst',
  'The Quant',
  'The Creative Strategist',
  "The Devil's Advocate",
  'The Futurist',
  'The Skeptic',
  'The Chairman',
];

const SLOT_COUNT = 7;

export default function SettingsPage() {
  const router = useRouter();
  const { apiKey, setApiKey, councillors, setCouncillors } = useCouncilStore();

  const [keyInput, setKeyInput] = useState(apiKey);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // Local slots
  const [slots, setSlots] = useState<Omit<Councillor, 'id'>[]>(() =>
    Array.from({ length: SLOT_COUNT }, (_, i) => ({
      modelId: '',
      modelName: '',
      persona: DEFAULT_PERSONAS[i],
      isChairman: i === SLOT_COUNT - 1,
      color: COLOURS[i],
    }))
  );

  // Pre-fill if coming back to settings
  useEffect(() => {
    if (councillors.length === SLOT_COUNT) {
      setSlots(
        councillors.map(({ modelId, modelName, persona, isChairman, color }) => ({
          modelId, modelName, persona, isChairman, color,
        }))
      );
    }
  }, [councillors]);

  const loadModels = useCallback(async () => {
    if (!keyInput.trim()) return;
    setLoadingModels(true);
    setModelError('');
    try {
      const list = await fetchModels(keyInput.trim());
      setModels(list);
      setApiKey(keyInput.trim());
    } catch {
      setModelError('Could not load models. Check your API key.');
    } finally {
      setLoadingModels(false);
    }
  }, [keyInput, setApiKey]);

  const filteredModels = models.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFree = !showFreeOnly || m.isFree;
    return matchSearch && matchFree;
  });

  const assignModel = (model: OpenRouterModel) => {
    if (activeSlot === null) return;
    setSlots((prev) =>
      prev.map((s, i) =>
        i === activeSlot ? { ...s, modelId: model.id, modelName: model.name } : s
      )
    );
    setActiveSlot(null);
  };

  const updatePersona = (idx: number, persona: string) => {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, persona } : s)));
  };

  const canProceed = slots.every((s) => s.modelId) && apiKey;

  const handleLaunch = () => {
    const councillorList: Councillor[] = slots.map((s, i) => ({
      id: `slot-${i}`,
      ...s,
    }));
    setCouncillors(councillorList);
    router.push('/council');
  };

  return (
    <main className="min-h-screen px-4 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <a href="/" className="text-council-muted text-sm hover:text-council-accent transition-colors mb-4 inline-block">
          ← Back to Home
        </a>
        <h1 className="text-4xl font-bold text-white mb-2">Council Setup</h1>
        <p className="text-council-muted">Configure your API key, select models, and assign personas.</p>
      </div>

      {/* Step 1: API Key */}
      <section className="council-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          <span className="text-council-accent mr-2">01</span>OpenRouter API Key
        </h2>
        <p className="text-council-muted text-sm mb-4">
          Your key is stored only in your browser — never sent to any server.{' '}
          <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer"
            className="text-council-accent hover:underline">
            Get a free key →
          </a>
        </p>
        <div className="flex gap-3">
          <input
            type="password"
            placeholder="sk-or-v1-..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadModels()}
            className="flex-1 px-4 py-3 rounded-lg text-sm text-white placeholder-council-muted focus:outline-none focus:ring-2 focus:ring-council-accent"
            style={{ background: '#0a0a0f', border: '1px solid #2a2a3a' }}
          />
          <button
            onClick={loadModels}
            disabled={!keyInput.trim() || loadingModels}
            className="px-6 py-3 rounded-lg font-semibold text-white text-sm transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)' }}
          >
            {loadingModels ? 'Loading…' : 'Load Models'}
          </button>
        </div>
        {modelError && <p className="text-red-400 text-sm mt-2">{modelError}</p>}
        {models.length > 0 && (
          <p className="text-council-success text-sm mt-2">
            ✓ {models.length} models loaded ({models.filter((m) => m.isFree).length} free)
          </p>
        )}
      </section>

      {/* Step 2: Council Seats */}
      <section className="council-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-1">
          <span className="text-council-accent mr-2">02</span>Assign Councillors
        </h2>
        <p className="text-council-muted text-sm mb-6">
          Click a seat to assign a model. Edit the persona name freely.{' '}
          <span className="text-council-gold">Seat 7 is always the Chairman.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl p-4 border transition-all duration-200 ${
                activeSlot === idx
                  ? 'border-council-accent shadow-lg'
                  : 'border-council-border hover:border-council-border/80'
              }`}
              style={{ background: activeSlot === idx ? 'rgba(108,99,255,0.08)' : '#13131a' }}
            >
              {/* Seat number + color bar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-6 rounded-full" style={{ background: slot.color }} />
                <span className="text-xs text-council-muted font-medium">
                  Seat {idx + 1}{slot.isChairman ? ' · Chairman' : ''}
                </span>
                {slot.isChairman && <span className="ml-auto text-council-gold text-sm">👑</span>}
              </div>

              {/* Model selector */}
              <button
                onClick={() => {
                  if (models.length === 0) return;
                  setActiveSlot(activeSlot === idx ? null : idx);
                }}
                disabled={models.length === 0}
                className="w-full text-left px-3 py-2 rounded-lg text-sm mb-3 transition-colors disabled:opacity-40"
                style={{
                  background: slot.modelId ? 'rgba(108,99,255,0.1)' : '#0a0a0f',
                  border: `1px solid ${slot.modelId ? slot.color + '66' : '#2a2a3a'}`,
                  color: slot.modelId ? '#e8e8f0' : '#7a7a9a',
                }}
              >
                {slot.modelId ? (
                  <span className="truncate block font-medium">{slot.modelName}</span>
                ) : (
                  <span>{models.length ? 'Click to pick a model' : 'Load models first'}</span>
                )}
              </button>

              {/* Persona name */}
              <input
                type="text"
                value={slot.persona}
                onChange={(e) => updatePersona(idx, e.target.value)}
                placeholder="Persona name"
                className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-council-muted focus:outline-none focus:ring-1 focus:ring-council-accent"
                style={{ background: '#0a0a0f', border: '1px solid #2a2a3a' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Model Picker Panel */}
      {activeSlot !== null && models.length > 0 && (
        <section className="council-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <h3 className="text-white font-semibold">
              Picking model for <span style={{ color: slots[activeSlot].color }}>{slots[activeSlot].persona || `Seat ${activeSlot + 1}`}</span>
            </h3>
            <div className="flex items-center gap-3 ml-auto">
              <label className="flex items-center gap-2 text-sm text-council-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFreeOnly}
                  onChange={(e) => setShowFreeOnly(e.target.checked)}
                  className="rounded"
                />
                Free only
              </label>
              <input
                type="text"
                placeholder="Search models…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm text-white placeholder-council-muted focus:outline-none focus:ring-1 focus:ring-council-accent w-48"
                style={{ background: '#0a0a0f', border: '1px solid #2a2a3a' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
            {filteredModels.map((m) => (
              <button
                key={m.id}
                onClick={() => assignModel(m)}
                className="text-left px-4 py-3 rounded-lg border transition-all hover:border-council-accent/60 hover:bg-council-accent/5"
                style={{ background: '#0a0a0f', border: '1px solid #2a2a3a' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">{m.name}</div>
                    <div className="text-xs text-council-muted truncate">{m.id}</div>
                  </div>
                  {m.isFree && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                      FREE
                    </span>
                  )}
                </div>
                {m.context_length && (
                  <div className="text-xs text-council-muted mt-1">
                    {(m.context_length / 1000).toFixed(0)}k ctx
                  </div>
                )}
              </button>
            ))}
            {filteredModels.length === 0 && (
              <div className="col-span-3 text-center text-council-muted py-8">No models match your filter.</div>
            )}
          </div>
        </section>
      )}

      {/* Launch */}
      <div className="flex justify-end">
        <button
          onClick={handleLaunch}
          disabled={!canProceed}
          className="px-10 py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-30 hover:scale-105"
          style={{
            background: canProceed ? 'linear-gradient(135deg, #6c63ff, #8b5cf6)' : '#2a2a3a',
            boxShadow: canProceed ? '0 0 40px rgba(108,99,255,0.35)' : 'none',
          }}
        >
          Convene the Council →
        </button>
      </div>
    </main>
  );
}
