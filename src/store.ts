import { create } from 'zustand';

export type Phase = 'lock' | 'desktop';

interface OsState {
  phase: Phase;
  activeApp: string;
  pointerActive: boolean;
  setPhase: (phase: Phase) => void;
  setActiveApp: (id: string) => void;
  setPointerActive: (value: boolean) => void;
  login: () => void;
}

export const useOs = create<OsState>((set) => ({
  phase: 'lock',
  activeApp: 'home',
  pointerActive: false,
  setPhase: (phase) => set({ phase }),
  setActiveApp: (activeApp) => set({ activeApp }),
  setPointerActive: (pointerActive) => set({ pointerActive }),
  login: () => set({ phase: 'desktop' }),
}));
