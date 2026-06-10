<?php

namespace App\Modules\Catalog\Domain;

interface CategoryRepositoryContract
{
    public function find(int $id): ?Category;

    public function save(Category $category): void;

    public function delete(Category $category): void;

    public function list(): array;
}
