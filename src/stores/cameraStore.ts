import { create } from 'zustand';
import type { PlantOrgan, PlantResult } from '../types';

interface CameraStore {
  capturedImage: string | null;
  selectedOrgan: PlantOrgan;
  isIdentifying: boolean;
  showOrganSelector: boolean;
  results: PlantResult[] | null;
  error: string | null;

  setCapturedImage: (uri: string | null) => void;
  setSelectedOrgan: (organ: PlantOrgan) => void;
  setIsIdentifying: (val: boolean) => void;
  setShowOrganSelector: (val: boolean) => void;
  setResults: (results: PlantResult[] | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  capturedImage: null,
  selectedOrgan: 'leaf',
  isIdentifying: false,
  showOrganSelector: false,
  results: null,
  error: null,

  setCapturedImage: (uri) => set({ capturedImage: uri }),
  setSelectedOrgan: (organ) => set({ selectedOrgan: organ }),
  setIsIdentifying: (val) => set({ isIdentifying: val }),
  setShowOrganSelector: (val) => set({ showOrganSelector: val }),
  setResults: (results) => set({ results }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      capturedImage: null,
      selectedOrgan: 'leaf',
      isIdentifying: false,
      showOrganSelector: false,
      results: null,
      error: null,
    }),
}));
