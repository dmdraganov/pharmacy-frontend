<?php

namespace App\Modules\Inventory\Domain;

interface InventoryRepositoryContract
{
    public function find(string $productId, int $pharmacyId): ?Inventory;

    public function save(Inventory $inventory): void;

    public function list(int $pharmacyId): array;
}
