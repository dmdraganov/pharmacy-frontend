<?php

namespace App\Modules\Pharmacies\Application\UseCases;

use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Shared\Application\UseCase;

class ListPharmacyProductsUseCase implements UseCase
{
    public function __construct(
        private readonly ProductRepositoryContract $productRepository
    ) {}

    public function __invoke(int $pharmacyId, array $criteria = []): array
    {
        return $this->productRepository->listByPharmacy($pharmacyId, $criteria);
    }
}
