import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Councillor = {
  id: string;           // unique slot id e.g. "slot-0"
  modelId: string;      // OpenRouter model id e.g. "anthropic/claude-sonnet-4-5"
  modelName: string;    // Human display name
  persona: string;      // Role name e.g. "The Analyst"
  customSystemPrompt?: string; // Optional user-defined system prompt override
  isChairman: boolean;
  color: string;        // Unique badge color per councillor
};

export type Message = {
  councillorId: string;
  round: 1 | 2 | 3;
  content: string;
  streaming?: boolean;
};

export type Turn = {
  turnIndex: number;
  userPrompt: string;
  messages: Message[];
  chairmanSummary: string;  // Saved after Round 3 — this is what carries to next turn
  completedRounds: number;  // 0 = none, 1, 2, 3
};

export type CouncilState = {
  // Settings
  apiKey: string;
  setApiKey: (key: string) => void;
  useWebSearch: boolean;
  setUseWebSearch: (val: boolean) => void;

  // Council setup
  councillors: Councillor[];
  setCouncillors: (c: Councillor[]) => void;
  updateCouncillor: (id: string, updates: Partial<Councillor>) => void;

  // Session
  turns: Turn[];
  activeTurnIndex: number;
  addTurn: (prompt: string) => void;
  appendMessage: (turnIdx: number, msg: Message) => void;
  updateMessageContent: (turnIdx: number, round: 1 | 2 | 3, councillorId: string, content: string, done?: boolean) => void;
  setChairmanSummary: (turnIdx: number, summary: string) => void;
  setCompletedRounds: (turnIdx: number, rounds: number) => void;

  // Helpers
  getPreviousChairmanSummary: () => string | null;
  restartTurn: (turnIdx: number) => void;
  resetSession: () => void;
};

const COLOURS = [
  '#ccff00', '#00e5ff', '#ff007f', '#ffaa00',
  '#b142ff', '#39ff14', '#ffffff',
];

export const useCouncilStore = create<CouncilState>()(
  persist(
    (set, get) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      useWebSearch: false,
      setUseWebSearch: (val) => set({ useWebSearch: val }),

      councillors: [],
      setCouncillors: (c) => set({ councillors: c }),
      updateCouncillor: (id, updates) => set((s) => ({
        councillors: s.councillors.map(c => c.id === id ? { ...c, ...updates } : c)
      })),

      turns: [],
      activeTurnIndex: -1,

      addTurn: (prompt) => {
        const idx = get().turns.length;
        const newTurn: Turn = {
          turnIndex: idx,
          userPrompt: prompt,
          messages: [],
          chairmanSummary: '',
          completedRounds: 0,
        };
        set((s) => ({ turns: [...s.turns, newTurn], activeTurnIndex: idx }));
      },

      appendMessage: (turnIdx, msg) => {
        set((s) => {
          const turns = [...s.turns];
          turns[turnIdx] = {
            ...turns[turnIdx],
            messages: [...turns[turnIdx].messages, msg],
          };
          return { turns };
        });
      },

      updateMessageContent: (turnIdx, round, councillorId, content, done = false) => {
        set((s) => {
          const turns = [...s.turns];
          const msgs = [...turns[turnIdx].messages];
          const i = msgs.findIndex(
            (m) => m.round === round && m.councillorId === councillorId
          );
          if (i >= 0) {
            msgs[i] = { ...msgs[i], content, streaming: !done };
          }
          turns[turnIdx] = { ...turns[turnIdx], messages: msgs };
          return { turns };
        });
      },

      setChairmanSummary: (turnIdx, summary) => {
        set((s) => {
          const turns = [...s.turns];
          turns[turnIdx] = { ...turns[turnIdx], chairmanSummary: summary };
          return { turns };
        });
      },

      setCompletedRounds: (turnIdx, rounds) => {
        set((s) => {
          const turns = [...s.turns];
          turns[turnIdx] = { ...turns[turnIdx], completedRounds: rounds };
          return { turns };
        });
      },

      getPreviousChairmanSummary: () => {
        const { turns, activeTurnIndex } = get();
        if (activeTurnIndex <= 0) return null;
        return turns[activeTurnIndex - 1]?.chairmanSummary || null;
      },

      restartTurn: (turnIdx) => {
        set((s) => {
          const turns = [...s.turns];
          turns[turnIdx] = { ...turns[turnIdx], messages: [], completedRounds: 0, chairmanSummary: '' };
          return { turns };
        });
      },

      resetSession: () => set({ turns: [], activeTurnIndex: -1 }),
    }),
    {
      name: 'llm-council-storage',
      partialize: (s) => ({
        apiKey: s.apiKey,
        useWebSearch: s.useWebSearch,
        councillors: s.councillors,
        turns: s.turns,
        activeTurnIndex: s.activeTurnIndex,
      }),
    }
  )
);

export { COLOURS };
