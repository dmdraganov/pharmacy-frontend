<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\Product;
use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Shared\Application\UseCase;

class GetProductUseCase implements UseCase
{
    public function __construct(
        private readonly ProductRepositoryContract $productRepository
    ) {}

    public function __invoke(string $id): ?Product
    {
        return $this->productRepository->find($id);
    }
}
