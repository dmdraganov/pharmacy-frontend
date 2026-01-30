import { createContext } from 'react';

interface RegionContextValue {
  region: string;
  setRegion: (region: string) => void;
}

export const RegionContext = createContext<RegionContextValue | undefined>(
  undefined
);
