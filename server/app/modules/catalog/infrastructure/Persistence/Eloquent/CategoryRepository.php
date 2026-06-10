<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\Category;
use App\Modules\Catalog\Domain\CategoryRepositoryContract;

class CategoryRepository implements CategoryRepositoryContract
{
    public function find(int $id): ?Category
    {
        $categoryModel = CategoryModel::find($id);
        if (! $categoryModel) {
            return null;
        }

        return $this->toDomain($categoryModel);
    }

    public function save(Category $category): void
    {
        $categoryModel = CategoryModel::find($category->id) ?? new CategoryModel;
        $categoryModel->id = $category->id;
        $categoryModel->name = $category->name;
        $categoryModel->description = $category->description;
        $categoryModel->section_id = $category->sectionId;
        $categoryModel->save();
    }

    public function delete(Category $category): void
    {
        CategoryModel::destroy($category->id);
    }

    public function list(): array
    {
        return CategoryModel::all()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(CategoryModel $categoryModel): Category
    {
        return new Category(
            id: $categoryModel->id,
            name: $categoryModel->name,
            description: $categoryModel->description,
            sectionId: $categoryModel->section_id
        );
    }
}
