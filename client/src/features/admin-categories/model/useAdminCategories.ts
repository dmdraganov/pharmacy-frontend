import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminCategory,
  deleteAdminCategory,
  getCategories,
  getSections,
  updateAdminCategory,
  type AdminCategoryPayload,
} from '@/shared/api';
import { ApiError } from '@/shared/api/apiClient';
import type { Category } from '@/entities/section';
import type { CategoryFormState } from './types';

const categoryFormToPayload = (
  form: CategoryFormState
): AdminCategoryPayload => ({
  name: form.name.trim(),
  description: form.description.trim() || null,
  section_id: Number(form.sectionId),
});

const validateCategoryForm = (form: CategoryFormState) => {
  if (!form.name.trim() || !form.sectionId) {
    return 'Заполните обязательные поля.';
  }

  return '';
};

export const useAdminCategories = () => {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState | null>(null);
  const [formError, setFormError] = useState('');
  const [apiErrors, setApiErrors] = useState<
    Record<string, string[]> | undefined
  >();

  const query = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const [categories, sections] = await Promise.all([
        getCategories(),
        getSections(),
      ]);
      return { categories, sections };
    },
  });

  const categories = useMemo(
    () => query.data?.categories || [],
    [query.data?.categories]
  );
  const sections = useMemo(
    () => query.data?.sections || [],
    [query.data?.sections]
  );
  const sectionNameById = useMemo(
    () => new Map(sections.map((section) => [section.id, section.name])),
    [sections]
  );

  const closeForm = () => {
    setEditingCategory(null);
    setForm(null);
    setFormError('');
    setApiErrors(undefined);
  };

  const openCreateForm = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      description: '',
      sectionId: sections[0]?.id || '',
    });
    setFormError('');
    setApiErrors(undefined);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: '',
      sectionId: category.sectionId,
    });
    setFormError('');
    setApiErrors(undefined);
  };

  const saveMutation = useMutation({
    mutationFn: async (currentForm: CategoryFormState) => {
      if (editingCategory) {
        return updateAdminCategory(
          editingCategory.id,
          categoryFormToPayload(currentForm)
        );
      }
      return createAdminCategory(categoryFormToPayload(currentForm));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
      ]);
      closeForm();
    },
    onError: (mutationError) => {
      if (mutationError instanceof ApiError) {
        setApiErrors(mutationError.errors);
        setFormError(mutationError.message);
        return;
      }
      setFormError('Не удалось сохранить категорию.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }),
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
      ]);
    },
  });

  const updateForm = (patch: Partial<CategoryFormState>) => {
    setForm((currentForm) =>
      currentForm ? { ...currentForm, ...patch } : null
    );
  };

  const submitForm = () => {
    if (!form) {
      return;
    }

    const validationError = validateCategoryForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError('');
    setApiErrors(undefined);
    saveMutation.mutate(form);
  };

  return {
    categories,
    sections,
    sectionNameById,
    isLoading: query.isLoading,
    error: query.error,
    editingCategory,
    form,
    formError,
    apiErrors,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreateForm,
    openEditForm,
    closeForm,
    updateForm,
    submitForm,
    deleteCategory: deleteMutation.mutate,
  };
};
