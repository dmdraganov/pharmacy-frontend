import type { ReactNode } from 'react';
import { memo, useState } from 'react';
import { RegionContext } from '@/features/region';

const RegionProvider = memo(({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<string>('Москва'); // Default region

  const value = {
    region,
    setRegion,
  };

  return (
    <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
  );
});

export default RegionProvider;
