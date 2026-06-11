import { apiRequest } from './apiClient';
import type { Category, Section } from '@/entities/section';

interface ApiSection {
  id: number | string;
  name: string;
}

interface ApiCategory {
  id: number | string;
  name: string;
  section_id?: number | string | null;
}

interface ApiBrand {
  id: number | string;
  name: string;
}

interface ApiManufacturer {
  id: number | string;
  name: string;
  country?: string | null;
}

const mapCategory = (category: ApiCategory): Category => ({
  id: String(category.id),
  name: category.name,
  sectionId: category.section_id ? String(category.section_id) : '',
});

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiRequest<ApiCategory[]>('/categories', {
    params: { per_page: 100 },
  });
  return response.data.map(mapCategory);
};

export const getSections = async (): Promise<Section[]> => {
  const [sectionsResponse, categories] = await Promise.all([
    apiRequest<ApiSection[]>('/sections', { params: { per_page: 100 } }),
    getCategories(),
  ]);

  return sectionsResponse.data.map((section) => {
    const id = String(section.id);
    return {
      id,
      name: section.name,
      categories: categories.filter((category) => category.sectionId === id),
    };
  });
};

export const getSectionById = async (
  id: string
): Promise<Section | undefined> => {
  const sections = await getSections();
  return sections.find((section) => section.id === id);
};

export const getBrands = async () => {
  const response = await apiRequest<ApiBrand[]>('/brands', {
    params: { per_page: 100 },
  });

  return response.data.map((brand) => ({
    id: String(brand.id),
    name: brand.name,
  }));
};

export const getManufacturers = async () => {
  const response = await apiRequest<ApiManufacturer[]>('/manufacturers', {
    params: { per_page: 100 },
  });

  return response.data.map((manufacturer) => ({
    id: String(manufacturer.id),
    name: manufacturer.country
      ? `${manufacturer.name}, ${manufacturer.country}`
      : manufacturer.name,
  }));
};
