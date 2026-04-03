import React, { useState, useEffect } from 'react';
import { Councillor, useCouncilStore } from '@/store/councilStore';
import { X } from 'lucide-react';

interface PersonaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  councillor: Councillor | null;
}

export default function PersonaEditModal({ isOpen, onClose, councillor }: PersonaEditModalProps) {
  const { updateCouncillor } = useCouncilStore();
  const [persona, setPersona] = useState('');
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');

  useEffect(() => {
    if (isOpen && councillor) {
      setPersona(councillor.persona);
      setCustomSystemPrompt(councillor.customSystemPrompt || '');
    }
  }, [isOpen, councillor]);

  if (!isOpen || !councillor) return null;

  const handleSave = () => {
    updateCouncillor(councillor.id, {
      persona: persona.trim() || `Seat`,
      customSystemPrompt: customSystemPrompt.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#09090b] rounded-2xl border flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        style={{ borderColor: councillor.color }}
      >
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="text-lg font-bold text-white">
            Edit Profile: <span style={{ color: councillor.color }}>{councillor.persona}</span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Persona Name</label>
            <input
              type="text"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
              placeholder="e.g. The Pragmatist"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Custom System Prompt <span className="text-xs text-council-muted font-normal ml-2">(Optional override)</span>
            </label>
            <textarea
              value={customSystemPrompt}
              onChange={(e) => setCustomSystemPrompt(e.target.value)}
              rows={6}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
              placeholder={`If left blank, the default prompt will be used:\n"You are {Persona}, a council member in a structured AI deliberation..."`}
            />
            <p className="text-xs text-council-muted mt-2">
              Any changes here will seamlessly apply to the very next prompt you send, allowing you to steer their personality mid-debate.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', background: '#111116', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-xl text-sm font-bold bg-[#ccff00] text-black hover:bg-[#aacc00] transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
