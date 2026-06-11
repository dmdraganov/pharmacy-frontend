import type { FormEvent } from 'react';
import type { Pharmacy } from '@/entities/pharmacy';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Input from '@/shared/ui/Input';
import Textarea from '@/shared/ui/Textarea';
import type { ProductFormState, SelectOption } from '../model/types';

const getFieldError = (
  errors: Record<string, string[]> | undefined,
  field: string
) => errors?.[field]?.[0];

const SelectField = ({
  id,
  label,
  value,
  options,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
}) => (
  <div className='w-full'>
    <label
      htmlFor={id}
      className='mb-1 block text-sm font-medium text-text-muted'
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded border border-border-default bg-background-default px-3 py-2 text-text-default focus:outline-2 focus:outline-primary ${
        error ? 'border-danger focus:outline-danger-emphasis text-danger' : ''
      }`}
    >
      <option value='' disabled>
        Выберите значение
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    {error && <p className='mt-1 text-sm text-danger'>{error}</p>}
  </div>
);

interface ProductFormDialogProps {
  form: ProductFormState;
  isEditing: boolean;
  isSaving: boolean;
  formError: string;
  apiErrors?: Record<string, string[]>;
  categories: SelectOption[];
  brands: SelectOption[];
  manufacturers: SelectOption[];
  selectedPharmacy?: Pharmacy;
  onClose: () => void;
  onSubmit: () => void;
  onNameChange: (name: string) => void;
  onChange: (patch: Partial<ProductFormState>) => void;
}

export const ProductFormDialog = ({
  form,
  isEditing,
  isSaving,
  formError,
  apiErrors,
  categories,
  brands,
  manufacturers,
  selectedPharmacy,
  onClose,
  onSubmit,
  onNameChange,
  onChange,
}: ProductFormDialogProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-6'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-3xl rounded bg-background-default p-4 shadow-xl sm:p-6'
      >
        <div className='mb-5 flex items-start justify-between gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-text-default'>
              {isEditing ? 'Редактирование товара' : 'Новый товар'}
            </h2>
            {selectedPharmacy && (
              <p className='text-sm text-text-muted'>
                Остаток сохраняется для аптеки: {selectedPharmacy.name}
              </p>
            )}
          </div>
          <Button type='button' variant='ghost' size='small' onClick={onClose}>
            Закрыть
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Input
            id='product-name'
            label='Название'
            value={form.name}
            onChange={(event) => onNameChange(event.target.value)}
            error={getFieldError(apiErrors, 'name')}
            required
          />
          <Input
            id='product-slug'
            label='Slug'
            value={form.slug}
            onChange={(event) => onChange({ slug: event.target.value })}
            error={getFieldError(apiErrors, 'slug')}
            required
          />
          <Input
            id='product-price'
            label='Цена'
            type='number'
            min='0'
            step='0.01'
            value={form.price}
            onChange={(event) => onChange({ price: event.target.value })}
            error={getFieldError(apiErrors, 'price')}
            required
          />
          <Input
            id='product-old-price'
            label='Старая цена'
            type='number'
            min='0'
            step='0.01'
            value={form.oldPrice}
            onChange={(event) => onChange({ oldPrice: event.target.value })}
            error={getFieldError(apiErrors, 'old_price')}
          />
          <SelectField
            id='product-category'
            label='Категория'
            value={form.categoryId}
            options={categories}
            onChange={(categoryId) => onChange({ categoryId })}
            error={getFieldError(apiErrors, 'category_id')}
          />
          <SelectField
            id='product-brand'
            label='Бренд'
            value={form.brandId}
            options={brands}
            onChange={(brandId) => onChange({ brandId })}
            error={getFieldError(apiErrors, 'brand_id')}
          />
          <SelectField
            id='product-manufacturer'
            label='Производитель'
            value={form.manufacturerId}
            options={manufacturers}
            onChange={(manufacturerId) => onChange({ manufacturerId })}
            error={getFieldError(apiErrors, 'manufacturer_id')}
          />
          <Input
            id='product-stock'
            label='Остаток'
            type='number'
            min='0'
            step='1'
            value={form.stockQuantity}
            onChange={(event) =>
              onChange({ stockQuantity: event.target.value })
            }
          />
        </div>

        <div className='mt-4'>
          <Textarea
            id='product-description'
            label='Описание'
            rows={4}
            value={form.description}
            onChange={(event) => onChange({ description: event.target.value })}
            error={getFieldError(apiErrors, 'description')}
          />
        </div>

        <div className='mt-4 flex flex-wrap gap-4'>
          <Checkbox
            id='product-popular'
            label='Популярный'
            checked={form.isPopular}
            onChange={(event) => onChange({ isPopular: event.target.checked })}
          />
          <Checkbox
            id='product-prescription'
            label='Рецептурный'
            checked={form.isPrescription}
            onChange={(event) =>
              onChange({ isPrescription: event.target.checked })
            }
          />
        </div>

        {formError && <p className='mt-4 text-sm text-danger'>{formError}</p>}

        <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Отмена
          </Button>
          <Button type='submit' disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  );
};
