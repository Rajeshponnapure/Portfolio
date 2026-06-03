import { create } from 'zustand';

export type Phase = 'boot' | 'lock' | 'desktop';

interface OsState {
  phase: Phase;
  /** 0 -> 1 boot loader progress */
  bootProgress: number;
  /** id of the currently focused dock app / section */
  activeApp: string;
  /** whether the custom OS pointer is over an interactive target */
  pointerActive: boolean;
  setPhase: (phase: Phase) => void;
  setBootProgress: (value: number) => void;
  setActiveApp: (id: string) => void;
  setPointerActive: (value: boolean) => void;
  /** skip the boot intro and jump straight to the lock screen */
  skipBoot: () => void;
  /** unlock -> enter the desktop narrative */
  login: () => void;
}

export const useOs = create<OsState>((set) => ({
  phase: 'boot',
  bootProgress: 0,
  activeApp: 'home',
  pointerActive: false,
  setPhase: (phase) => set({ phase }),
  setBootProgress: (bootProgress) => set({ bootProgress }),
  setActiveApp: (activeApp) => set({ activeApp }),
  setPointerActive: (pointerActive) => set({ pointerActive }),
  skipBoot: () => set({ phase: 'lock', bootProgress: 1 }),
  login: () => set({ phase: 'desktop' }),
}));
