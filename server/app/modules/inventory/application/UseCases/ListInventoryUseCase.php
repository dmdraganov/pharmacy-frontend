<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Domain\InventoryRepositoryContract;
use App\Shared\Application\UseCase;

class ListInventoryUseCase implements UseCase
{
    public function __construct(
        private readonly InventoryRepositoryContract $inventoryRepository
    ) {}

    public function __invoke(int $pharmacyId): array
    {
        return $this->inventoryRepository->list($pharmacyId);
    }
}
