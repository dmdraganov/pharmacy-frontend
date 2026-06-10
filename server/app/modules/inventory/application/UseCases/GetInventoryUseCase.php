<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Domain\Inventory;
use App\Modules\Inventory\Domain\InventoryRepositoryContract;
use App\Shared\Application\UseCase;

class GetInventoryUseCase implements UseCase
{
    public function __construct(
        private readonly InventoryRepositoryContract $inventoryRepository
    ) {}

    public function __invoke(string $productId, int $pharmacyId): ?Inventory
    {
        return $this->inventoryRepository->find($productId, $pharmacyId);
    }
}
