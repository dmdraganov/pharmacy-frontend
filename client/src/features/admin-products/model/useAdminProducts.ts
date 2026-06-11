import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminInventory,
  getBrands,
  getManufacturers,
  getPharmacies,
  getProducts,
  getSections,
  updateAdminInventory,
  updateAdminProduct,
} from '@/shared/api';
import { ApiError } from '@/shared/api/apiClient';
import type { Product } from '@/entities/product';
import {
  createEmptyProductForm,
  createProductFormFromProduct,
  productFormToPayload,
  slugifyProductName,
  validateProductForm,
} from '../lib/form';
import type { ProductFormState } from './types';

export const useAdminProducts = () => {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState | null>(null);
  const [formError, setFormError] = useState('');
  const [apiErrors, setApiErrors] = useState<
    Record<string, string[]> | undefined
  >();

  const query = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const [products, sections, pharmacies, brands, manufacturers] =
        await Promise.all([
          getProducts({ per_page: 100 }),
          getSections(),
          getPharmacies(),
          getBrands(),
          getManufacturers(),
        ]);
      const selectedPharmacy = pharmacies[0];
      const inventory = selectedPharmacy
        ? await getAdminInventory(selectedPharmacy.id)
        : [];

      return {
        products,
        sections,
        pharmacies,
        brands,
        manufacturers,
        selectedPharmacy,
        inventory,
      };
    },
  });

  const categories = useMemo(
    () => (query.data?.sections || []).flatMap((section) => section.categories),
    [query.data?.sections]
  );

  const inventoryByProductId = useMemo(
    () =>
      new Map(
        (query.data?.inventory || []).map((item) => [item.productId, item])
      ),
    [query.data?.inventory]
  );

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const closeForm = () => {
    setEditingProduct(null);
    setForm(null);
    setFormError('');
    setApiErrors(undefined);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setForm(
      createEmptyProductForm(
        categories,
        query.data?.brands || [],
        query.data?.manufacturers || []
      )
    );
    setFormError('');
    setApiErrors(undefined);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setForm(
      createProductFormFromProduct(
        product,
        inventoryByProductId.get(product.id)?.stockQuantity
      )
    );
    setFormError('');
    setApiErrors(undefined);
  };

  const saveMutation = useMutation({
    mutationFn: async (currentForm: ProductFormState) => {
      const savedProduct = editingProduct
        ? await updateAdminProduct(
            editingProduct.id,
            productFormToPayload(currentForm)
          )
        : await createAdminProduct(productFormToPayload(currentForm));

      if (query.data?.selectedPharmacy && currentForm.stockQuantity !== '') {
        await updateAdminInventory(
          query.data.selectedPharmacy.id,
          savedProduct.id,
          Number(currentForm.stockQuantity)
        );
      }

      return savedProduct;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      closeForm();
    },
    onError: (mutationError) => {
      if (mutationError instanceof ApiError) {
        setApiErrors(mutationError.errors);
        setFormError(mutationError.message);
        return;
      }
      setFormError('Не удалось сохранить товар.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });

  const updateForm = (patch: Partial<ProductFormState>) => {
    setForm((currentForm) =>
      currentForm ? { ...currentForm, ...patch } : null
    );
  };

  const updateName = (name: string) => {
    setForm((currentForm) => {
      if (!currentForm) {
        return null;
      }

      return {
        ...currentForm,
        name,
        slug:
          currentForm.slug && editingProduct
            ? currentForm.slug
            : slugifyProductName(name),
      };
    });
  };

  const submitForm = () => {
    if (!form) {
      return;
    }

    const validationError = validateProductForm(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError('');
    setApiErrors(undefined);
    saveMutation.mutate(form);
  };

  return {
    products: query.data?.products || [],
    categories,
    brands: query.data?.brands || [],
    manufacturers: query.data?.manufacturers || [],
    selectedPharmacy: query.data?.selectedPharmacy,
    inventoryByProductId,
    categoryNameById,
    isLoading: query.isLoading,
    error: query.error,
    editingProduct,
    form,
    formError,
    apiErrors,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreateForm,
    openEditForm,
    closeForm,
    updateForm,
    updateName,
    submitForm,
    deleteProduct: deleteMutation.mutate,
  };
};
