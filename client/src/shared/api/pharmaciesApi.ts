import { apiRequest } from './apiClient';
import type { Pharmacy } from '@/entities/pharmacy';

interface ApiPharmacy {
  id: number | string;
  name: string;
  address: string;
  working_hours?: string | null;
}

const mapPharmacy = (pharmacy: ApiPharmacy): Pharmacy => ({
  id: String(pharmacy.id),
  name: pharmacy.name,
  address: pharmacy.address,
  workingHours: pharmacy.working_hours || '',
});

export const getPharmacies = async (): Promise<Pharmacy[]> => {
  const response = await apiRequest<ApiPharmacy[]>('/pharmacies', {
    params: { per_page: 100 },
  });
  return response.data.map(mapPharmacy);
};
