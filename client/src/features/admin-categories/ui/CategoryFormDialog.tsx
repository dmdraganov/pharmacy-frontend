import type { FormEvent } from 'react';
import type { Section } from '@/entities/section';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Textarea from '@/shared/ui/Textarea';
import type { CategoryFormState } from '../model/types';

const getFieldError = (
  errors: Record<string, string[]> | undefined,
  field: string
) => errors?.[field]?.[0];

interface CategoryFormDialogProps {
  form: CategoryFormState;
  isEditing: boolean;
  isSaving: boolean;
  formError: string;
  apiErrors?: Record<string, string[]>;
  sections: Section[];
  onClose: () => void;
  onSubmit: () => void;
  onChange: (patch: Partial<CategoryFormState>) => void;
}

export const CategoryFormDialog = ({
  form,
  isEditing,
  isSaving,
  formError,
  apiErrors,
  sections,
  onClose,
  onSubmit,
  onChange,
}: CategoryFormDialogProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-6'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-xl rounded bg-background-default p-4 shadow-xl sm:p-6'
      >
        <div className='mb-5 flex items-start justify-between gap-4'>
          <h2 className='text-xl font-semibold text-text-default'>
            {isEditing ? 'Редактирование категории' : 'Новая категория'}
          </h2>
          <Button type='button' variant='ghost' size='small' onClick={onClose}>
            Закрыть
          </Button>
        </div>

        <div className='grid gap-4'>
          <Input
            id='category-name'
            label='Название'
            value={form.name}
            onChange={(event) => onChange({ name: event.target.value })}
            error={getFieldError(apiErrors, 'name')}
            required
          />
          <div>
            <label
              htmlFor='category-section'
              className='mb-1 block text-sm font-medium text-text-muted'
            >
              Раздел
            </label>
            <select
              id='category-section'
              value={form.sectionId}
              onChange={(event) => onChange({ sectionId: event.target.value })}
              className={`w-full rounded border border-border-default bg-background-default px-3 py-2 text-text-default focus:outline-2 focus:outline-primary ${
                getFieldError(apiErrors, 'section_id')
                  ? 'border-danger focus:outline-danger-emphasis text-danger'
                  : ''
              }`}
              required
            >
              <option value='' disabled>
                Выберите раздел
              </option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {getFieldError(apiErrors, 'section_id') && (
              <p className='mt-1 text-sm text-danger'>
                {getFieldError(apiErrors, 'section_id')}
              </p>
            )}
          </div>
          <Textarea
            id='category-description'
            label='Описание'
            rows={3}
            value={form.description}
            onChange={(event) => onChange({ description: event.target.value })}
            error={getFieldError(apiErrors, 'description')}
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
