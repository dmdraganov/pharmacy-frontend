<?php

namespace App\Modules\Inventory\Application\UseCases;

use App\Modules\Inventory\Application\DTO\UpdateInventoryDTO;
use App\Modules\Inventory\Domain\Inventory;
use App\Modules\Inventory\Domain\InventoryRepositoryContract;
use App\Shared\Application\UseCase;

class UpdateInventoryUseCase implements UseCase
{
    public function __construct(
        private readonly InventoryRepositoryContract $inventoryRepository
    ) {}

    public function __invoke(UpdateInventoryDTO $data): Inventory
    {
        $inventory = $this->inventoryRepository->find($data->productId, $data->pharmacyId);
        if (! $inventory) {
            $inventory = new Inventory(
                productId: $data->productId,
                pharmacyId: $data->pharmacyId,
                stockQuantity: $data->stockQuantity,
                reservedQuantity: 0,
                updatedAt: new \DateTimeImmutable
            );
        } else {
            $inventory->stockQuantity = $data->stockQuantity;
        }

        $this->inventoryRepository->save($inventory);

        return $inventory;
    }
}
