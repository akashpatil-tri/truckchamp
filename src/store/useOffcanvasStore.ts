import { create } from "zustand";

interface OffcanvasStore {
    openOffcanvasId: string | null;
    offcanvasData: unknown;
    openOffcanvas: (id: string, data?: unknown) => void;
    closeOffcanvas: () => void;
}

export const useOffcanvasStore = create<OffcanvasStore>((set) => ({
    openOffcanvasId: null,
    offcanvasData: null,
    openOffcanvas: (id: string, data?: unknown) => set({ openOffcanvasId: id, offcanvasData: data }),
    closeOffcanvas: () => set({ openOffcanvasId: null, offcanvasData: null }),
}));
