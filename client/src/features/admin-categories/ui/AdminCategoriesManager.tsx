import type { Category } from '@/entities/section';
import Button from '@/shared/ui/Button';
import Spinner from '@/shared/ui/Spinner';
import { useAdminCategories } from '../model/useAdminCategories';
import { CategoryFormDialog } from './CategoryFormDialog';
import { CategoryList } from './CategoryList';

export const AdminCategoriesManager = () => {
  const adminCategories = useAdminCategories();

  const handleDelete = (category: Category) => {
    if (window.confirm(`Удалить категорию "${category.name}"?`)) {
      adminCategories.deleteCategory(category.id);
    }
  };

  if (adminCategories.isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (adminCategories.error) {
    return (
      <div className='flex h-96 items-center justify-center text-center text-danger'>
        <div>
          <h2 className='text-2xl font-bold'>Ошибка при загрузке категорий</h2>
          <p>{adminCategories.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold text-text-default'>Категории</h1>
        <Button
          onClick={adminCategories.openCreateForm}
          disabled={!adminCategories.sections.length}
        >
          Добавить категорию
        </Button>
      </div>

      <CategoryList
        categories={adminCategories.categories}
        sectionNameById={adminCategories.sectionNameById}
        isDeleting={adminCategories.isDeleting}
        onEdit={adminCategories.openEditForm}
        onDelete={handleDelete}
      />

      {adminCategories.form && (
        <CategoryFormDialog
          form={adminCategories.form}
          isEditing={Boolean(adminCategories.editingCategory)}
          isSaving={adminCategories.isSaving}
          formError={adminCategories.formError}
          apiErrors={adminCategories.apiErrors}
          sections={adminCategories.sections}
          onClose={adminCategories.closeForm}
          onSubmit={adminCategories.submitForm}
          onChange={adminCategories.updateForm}
        />
      )}
    </div>
  );
};
