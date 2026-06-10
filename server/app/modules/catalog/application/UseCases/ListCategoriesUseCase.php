<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\CategoryRepositoryContract;
use App\Shared\Application\UseCase;

class ListCategoriesUseCase implements UseCase
{
    public function __construct(
        private readonly CategoryRepositoryContract $categoryRepository
    ) {}

    public function __invoke(): array
    {
        return $this->categoryRepository->list();
    }
}
