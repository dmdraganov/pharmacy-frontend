<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Shared\Application\UseCase;

class DeleteProductUseCase implements UseCase
{
    public function __construct(
        private readonly ProductRepositoryContract $productRepository
    ) {}

    public function __invoke(string $id): void
    {
        $product = $this->productRepository->find($id);
        $this->productRepository->delete($product);
    }
}
