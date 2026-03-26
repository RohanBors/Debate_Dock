'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCouncilStore, Councillor, COLOURS } from '@/store/councilStore';
import { fetchModels, OpenRouterModel } from '@/lib/openrouter';
import { Github, Crown, Check, Loader2, Edit2 } from 'lucide-react';
import ModelPicker from '@/components/ui/ModelPicker';

const DEFAULT_PERSONAS = [
  'Analyst',
  'Quant',
  'Strategist',
  'Devil\'s Advocate',
  'Futurist',
  'Skeptic',
  'Chairman',
];

const SLOT_COUNT = 7;

export default function SettingsPage() {
  const router = useRouter();
  const { apiKey, setApiKey, councillors, setCouncillors } = useCouncilStore();

  const [keyInput, setKeyInput] = useState(apiKey);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelError, setModelError] = useState('');
  
  // Modal state
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreeOnly, setShowFreeOnly] = useState(true);

  // Inline editing state for personas
  const [editingPersona, setEditingPersona] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [slots, setSlots] = useState<Omit<Councillor, 'id'>[]>(() =>
    Array.from({ length: SLOT_COUNT }, (_, i) => ({
      modelId: '',
      modelName: '',
      persona: DEFAULT_PERSONAS[i],
      isChairman: i === SLOT_COUNT - 1,
      color: COLOURS[i],
    }))
  );

  useEffect(() => {
    if (councillors.length === SLOT_COUNT) {
      setSlots(councillors.map(({ modelId, modelName, persona, isChairman, color }) => ({
        modelId, modelName, persona, isChairman, color,
      })));
    }
  }, [councillors]);

  useEffect(() => {
    if (editingPersona !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingPersona]);

  const loadModels = useCallback(async () => {
    if (!keyInput.trim()) return;
    setLoadingModels(true);
    setModelError('');
    try {
      const list = await fetchModels(keyInput.trim());
      setModels(list);
      setApiKey(keyInput.trim());
    } catch {
      setModelError('Invalid API key or network error.');
    } finally {
      setLoadingModels(false);
    }
  }, [keyInput, setApiKey]);

  const handleLaunch = () => {
    setCouncillors(slots.map((s, i) => ({ id: \`slot-\${i}\`, ...s })));
    router.push('/council');
  };

  const updatePersona = (idx: number, persona: string) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, persona } : s));
  };

  const canProceed = slots.every(s => s.modelId) && apiKey;

  return (
    <div className="min-h-screen bg-[#000] text-[#E5E5E5] font-sans">
      {/* ── Fixed Header Nav ── */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#111116] border-b border-white/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="font-bold text-lg text-white font-inter">Debate Dock</div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-white">1. Configure</span>
            <span className="text-gray-500">→ 2. Debate</span>
            <span className="text-gray-500">→ 3. Results</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Back to Home
          </button>
          <a href="https://github.com/RohanBors" target="_blank" rel="noopener" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Github className="w-4 h-4 text-white" />
          </a>
          <div className="w-8 h-8 rounded-full bg-[#ccff00] text-black font-bold flex items-center justify-center text-xs">
            RB
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        {/* ── API Key Single Card ── */}
        <div className="bg-[#0A0A0E] border border-white/10 rounded-2xl p-6 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                OpenRouter Key
                {models.length > 0 && <Check className="w-4 h-4 text-green-400" />}
              </h2>
              {models.length === 0 ? (
                <div className="text-sm text-gray-400">
                  Required to fetch available models. <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" className="text-[#ccff00] hover:underline relative group inline-block">How to get a key?</a>
                </div>
              ) : (
                <div className="text-sm text-green-400 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {models.length} models loaded • {models.filter(m => m.isFree).length} free
                </div>
              )}
            </div>
            
            <div className="w-full md:w-auto flex flex-1 max-w-lg gap-3">
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadModels()}
                className="flex-1 h-12 px-4 rounded-xl bg-black border border-white/15 text-white placeholder-gray-600 focus:outline-none focus:border-[#ccff00] transition-colors"
              />
              <button
                onClick={loadModels}
                disabled={!keyInput.trim() || loadingModels}
                className="h-12 px-6 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-400 transition-all flex items-center gap-2"
              >
                {loadingModels && <Loader2 className="w-4 h-4 animate-spin" />}
                Load
              </button>
            </div>
          </div>
          {modelError && <div className="mt-3 text-red-400 text-sm font-medium pl-1">{modelError}</div>}
        </div>

        {/* ── Council Grid ── */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Assemble Council</h2>
          <span className="text-sm font-medium text-gray-500">7 Seats Required</span>
        </div>

        {/* Top 6 Debaters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {slots.slice(0, 6).map((slot, idx) => (
            <div key={idx} className="bg-[#0D0D11] rounded-2xl p-6 relative group transition-all" style={{ borderTop: \`4px solid \${slot.color}\`, boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              
              {/* Persona Inline Edit */}
              <div className="mb-5 flex items-center gap-2 group/title cursor-text" onClick={() => setEditingPersona(idx)}>
                {editingPersona === idx ? (
                  <input
                    ref={inputRef}
                    value={slot.persona}
                    onChange={(e) => updatePersona(idx, e.target.value)}
                    onBlur={() => setEditingPersona(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingPersona(null)}
                    className="bg-black/50 border border-white/20 text-white font-bold px-2 py-0.5 rounded text-sm w-full outline-none focus:border-[#ccff00]"
                  />
                ) : (
                  <>
                    <div className="font-bold text-white text-sm tracking-wide">{slot.persona}</div>
                    <Edit2 className="w-3 h-3 text-gray-600 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                  </>
                )}
              </div>

              {/* Model Select Button */}
              <button
                onClick={() => setActiveSlot(idx)}
                disabled={models.length === 0}
                className="w-full p-3 rounded-xl text-left transition-all border disabled:opacity-50"
                style={{
                  background: slot.modelId ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderColor: slot.modelId ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                  borderStyle: slot.modelId ? 'solid' : 'dashed',
                }}
              >
                {slot.modelId ? (
                  <div>
                    <div className="text-white font-medium text-[13px] truncate">{slot.modelName.split(':').pop() || slot.modelName}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">{slot.modelId.split('/')[0]}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 font-medium py-1">{models.length ? '+ Select Model' : 'Load keys first'}</div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Chairman (Seat 7) */}
        <div className="bg-[#0D0D11] rounded-2xl p-7 relative" style={{ borderTop: '5px solid #f59e0b', boxShadow: '0 8px 30px rgba(245, 158, 11, 0.08)' }}>
          <div className="absolute top-0 right-7 -translate-y-1/2 bg-[#f59e0b] text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <Crown className="w-3 h-3 black" />
            Fixed Role
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-64 shrink-0">
              <div className="font-bold text-[#f59e0b] text-lg mb-1 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Chairman
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The Chairman stays silent during the debate rounds, only speaking to deliver the final synthesis verdict.
              </p>
            </div>
            
            <div className="w-full flex-1">
              <button
                onClick={() => setActiveSlot(6)}
                disabled={models.length === 0}
                className="w-full p-4 rounded-xl text-left transition-all border disabled:opacity-50"
                style={{
                  background: slots[6].modelId ? 'rgba(245,158,11,0.05)' : 'transparent',
                  borderColor: slots[6].modelId ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
                  borderStyle: slots[6].modelId ? 'solid' : 'dashed',
                }}
              >
                {slots[6].modelId ? (
                  <div>
                    <div className="text-white font-bold text-[15px] truncate">{slots[6].modelName}</div>
                    <div className="text-[12px] text-gray-500 mt-1 truncate">{slots[6].modelId}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 font-medium py-2 text-center md:text-left">{models.length ? '+ Select Synthesis Model' : 'Load keys to pick Chairman'}</div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleLaunch}
            disabled={!canProceed}
            className="h-14 px-8 rounded-xl font-bold text-[15px] transition-all disabled:opacity-20 flex items-center gap-3 disabled:hover:scale-100 hover:scale-[1.02]"
            style={{
              background: canProceed ? '#ccff00' : '#1A1A24',
              color: canProceed ? '#000000' : '#666',
              boxShadow: canProceed ? 'inset 0 -3px 10px rgba(0,0,0,0.2), 0 0 30px rgba(204,255,0,0.3)' : 'none',
            }}
          >
            Convene the Council
            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">→</div>
          </button>
        </div>
      </main>

      <ModelPicker
        isOpen={activeSlot !== null}
        onClose={() => setActiveSlot(null)}
        models={models}
        activeSlot={activeSlot}
        slots={slots}
        onAssign={(model) => {
          if (activeSlot === null) return;
          setSlots(prev => prev.map((s, i) => i === activeSlot ? { ...s, modelId: model.id, modelName: model.name } : s));
          setActiveSlot(null);
        }}
        showFreeOnly={showFreeOnly}
        setShowFreeOnly={setShowFreeOnly}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
