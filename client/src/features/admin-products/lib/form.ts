import type { Product } from '@/entities/product';
import type { Category } from '@/entities/section';
import type { AdminProductPayload } from '@/shared/api';
import type { ProductFormState, SelectOption } from '../model/types';

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

export const slugifyProductName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[а-яё]/g, (char) => CYRILLIC_TO_LATIN[char] || '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const createEmptyProductForm = (
  categories: Category[],
  brands: SelectOption[],
  manufacturers: SelectOption[]
): ProductFormState => ({
  name: '',
  slug: '',
  description: '',
  price: '',
  oldPrice: '',
  categoryId: categories[0]?.id || '',
  brandId: brands[0]?.id || '',
  manufacturerId: manufacturers[0]?.id || '',
  stockQuantity: '',
  isPopular: false,
  isPrescription: false,
});

export const createProductFormFromProduct = (
  product: Product,
  stockQuantity?: number
): ProductFormState => ({
  name: product.name,
  slug: slugifyProductName(product.name) || product.id,
  description: product.description?.join('\n') || '',
  price: String(product.price),
  oldPrice: product.oldPrice ? String(product.oldPrice) : '',
  categoryId: product.categoryId,
  brandId: product.brandId || '',
  manufacturerId: product.manufacturerId || '',
  stockQuantity: stockQuantity !== undefined ? String(stockQuantity) : '',
  isPopular: Boolean(product.isPopular),
  isPrescription: Boolean(product.isPrescription),
});

export const productFormToPayload = (
  form: ProductFormState
): AdminProductPayload => ({
  name: form.name.trim(),
  slug: form.slug.trim(),
  description: form.description.trim() || null,
  price: Number(form.price),
  old_price: form.oldPrice ? Number(form.oldPrice) : null,
  is_popular: form.isPopular,
  is_prescription: form.isPrescription,
  category_id: Number(form.categoryId),
  brand_id: Number(form.brandId),
  manufacturer_id: Number(form.manufacturerId),
});

export const validateProductForm = (form: ProductFormState): string => {
  if (
    !form.name.trim() ||
    !form.slug.trim() ||
    !form.price ||
    !form.categoryId ||
    !form.brandId ||
    !form.manufacturerId
  ) {
    return 'Заполните обязательные поля.';
  }

  if (Number(form.price) < 0 || Number(form.oldPrice || 0) < 0) {
    return 'Цена не может быть отрицательной.';
  }

  if (
    form.stockQuantity !== '' &&
    (!Number.isInteger(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0)
  ) {
    return 'Остаток должен быть целым неотрицательным числом.';
  }

  return '';
};
