"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type DraftMap = Record<string, Record<string, unknown>>;

interface DraftState {
  drafts: DraftMap;
  set: (key: string, values: Record<string, unknown>) => void;
  clear: (key: string) => void;
  get: (key: string) => Record<string, unknown> | undefined;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      set: (key, values) =>
        set((s) => ({ drafts: { ...s.drafts, [key]: values } })),
      clear: (key) =>
        set((s) => {
          const { [key]: _, ...rest } = s.drafts;
          return { drafts: rest };
        }),
      get: (key) => get().drafts[key],
    }),
    { name: "modal-draft", version: 1 },
  ),
);
