import { create } from 'zustand';
import { REGIONS } from '../lib/constants';

interface RegionState {
  region: string;
  setRegion: (region: string) => void;
}

export const useRegionStore = create<RegionState>()((set) => ({
  region: REGIONS[0],
  setRegion: (region: string) => set({ region }),
}));
