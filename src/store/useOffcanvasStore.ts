import { create } from "zustand";

interface OffcanvasStore {
    openOffcanvasId: string | null;
    openOffcanvas: (id: string) => void;
    closeOffcanvas: () => void;
}

export const useOffcanvasStore = create<OffcanvasStore>((set) => ({
    openOffcanvasId: null,
    openOffcanvas: (id: string) => set({ openOffcanvasId: id }),
    closeOffcanvas: () => set({ openOffcanvasId: null }),
}));
