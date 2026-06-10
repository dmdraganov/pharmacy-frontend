import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { REGIONS } from '../lib/constants';

interface RegionState {
  region: string;
  setRegion: (region: string) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      region: REGIONS[0], // Default region
      setRegion: (region: string) => set({ region }),
    }),
    {
      name: STORAGE_KEYS.REGION,
      storage: createJSONStorage(() => localStorage),
      // Only persist the region, not the actions
      partialize: (state) => ({ region: state.region }),
    }
  )
);
