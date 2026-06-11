import type { Product } from '@/entities/product';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import { useAdminProducts } from '../model/useAdminProducts';
import { ProductFormDialog } from './ProductFormDialog';
import { ProductList } from './ProductList';

export const AdminProductsManager = () => {
  const adminProducts = useAdminProducts();

  const handleDelete = (product: Product) => {
    if (window.confirm(`Удалить товар "${product.name}"?`)) {
      adminProducts.deleteProduct(product.id);
    }
  };

  if (adminProducts.isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (adminProducts.error) {
    return (
      <div className='flex h-96 items-center justify-center text-center text-danger'>
        <div>
          <h2 className='text-2xl font-bold'>Ошибка при загрузке данных</h2>
          <p>{adminProducts.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold text-text-default'>Товары</h1>
        <Button
          onClick={adminProducts.openCreateForm}
          disabled={!adminProducts.categories.length}
        >
          Добавить товар
        </Button>
      </div>
      {adminProducts.selectedPharmacy && (
        <p className='text-sm text-text-muted'>
          Остатки показаны для аптеки: {adminProducts.selectedPharmacy.name}
        </p>
      )}

      <ProductList
        products={adminProducts.products}
        inventoryByProductId={adminProducts.inventoryByProductId}
        categoryNameById={adminProducts.categoryNameById}
        isDeleting={adminProducts.isDeleting}
        onEdit={adminProducts.openEditForm}
        onDelete={handleDelete}
      />

      {adminProducts.form && (
        <ProductFormDialog
          form={adminProducts.form}
          isEditing={Boolean(adminProducts.editingProduct)}
          isSaving={adminProducts.isSaving}
          formError={adminProducts.formError}
          apiErrors={adminProducts.apiErrors}
          categories={adminProducts.categories}
          brands={adminProducts.brands}
          manufacturers={adminProducts.manufacturers}
          selectedPharmacy={adminProducts.selectedPharmacy}
          onClose={adminProducts.closeForm}
          onSubmit={adminProducts.submitForm}
          onNameChange={adminProducts.updateName}
          onChange={adminProducts.updateForm}
        />
      )}
    </div>
  );
};
