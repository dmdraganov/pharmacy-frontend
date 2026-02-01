import type { ReactNode } from 'react';
import { useState } from 'react';
import { RegionContext } from '../context';
import { REGIONS } from '../lib/constants';

const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<string>(REGIONS[0]); // Default region

  const value = {
    region,
    setRegion,
  };

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
};

export default RegionProvider;
