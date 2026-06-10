<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Shared\Application\UseCase;

class ListProductsUseCase implements UseCase
{
    public function __construct(
        private readonly ProductRepositoryContract $productRepository
    ) {}

    public function __invoke(array $criteria = []): array
    {
        return $this->productRepository->list($criteria);
    }
}
