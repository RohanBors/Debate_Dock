import { OpenRouterModel } from '@/lib/openrouter';
import { Councillor } from '@/store/councilStore';
import { X, Search } from 'lucide-react';

interface ModelPickerProps {
  isOpen: boolean;
  onClose: () => void;
  models: OpenRouterModel[];
  activeSlot: number | null;
  slots: Omit<Councillor, 'id'>[];
  onAssign: (model: OpenRouterModel) => void;
  showFreeOnly: boolean;
  setShowFreeOnly: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export default function ModelPicker({
  isOpen, onClose, models, activeSlot, slots, onAssign,
  showFreeOnly, setShowFreeOnly, searchQuery, setSearchQuery,
}: ModelPickerProps) {
  if (!isOpen || activeSlot === null) return null;

  const filteredModels = models.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFree = !showFreeOnly || m.isFree;
    return matchSearch && matchFree;
  });

  const activePersona = slots[activeSlot].persona || `Seat ${activeSlot + 1}`;
  const activeColor = slots[activeSlot].color;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-4xl bg-[#09090b] rounded-2xl border flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        style={{ borderColor: activeColor, maxHeight: '85vh' }}
      >
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="text-lg font-bold text-white">
            Pick model for <span style={{ color: activeColor }}>{activePersona}</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticky Toolbar */}
        <div style={{ padding: '12px 24px', background: '#111116', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search models by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showFreeOnly}
              onChange={(e) => setShowFreeOnly(e.target.checked)}
              className="rounded bg-black border-white/20 text-[#ccff00]"
            />
            Free models only
          </label>
        </div>

        {/* Scrollable Grid */}
        <div className="p-6 overflow-y-auto" style={{ flex: 1 }}>
          {filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredModels.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onAssign(m)}
                  className="group text-left p-4 rounded-xl border border-white/10 bg-[#0a0a0f] hover:bg-white/[0.02] transition-all hover:scale-[1.02] hover:-translate-y-0.5"
                  style={{ '&:hover': { borderColor: activeColor } } as React.CSSProperties}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-white truncate group-hover:text-white transition-colors" style={{ color: '#E5E5E5' }}>{m.name}</div>
                      <div className="text-[11px] text-gray-500 truncate mt-0.5">{m.id.split('/')[0]}</div>
                    </div>
                    {m.isFree && (
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px dashed rgba(255,255,255,0.05)' }}>
                    <div className="text-[11px] text-gray-400">
                      <span className="font-semibold text-gray-300">{(m.context_length / 1000).toFixed(0)}k</span> ctx
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-gray-500 text-sm">
               No models match "{searchQuery}" {showFreeOnly ? 'in free tier' : ''}.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
