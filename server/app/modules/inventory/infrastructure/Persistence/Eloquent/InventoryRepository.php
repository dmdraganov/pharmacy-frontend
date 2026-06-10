<?php

namespace App\Modules\Inventory\Infrastructure\Persistence\Eloquent;

use App\Modules\Inventory\Domain\Inventory;
use App\Modules\Inventory\Domain\InventoryRepositoryContract;
use Illuminate\Support\Facades\DB;

class InventoryRepository implements InventoryRepositoryContract
{
    public function find(string $productId, int $pharmacyId): ?Inventory
    {
        $inventoryModel = InventoryModel::where('product_id', $productId)
            ->where('pharmacy_id', $pharmacyId)
            ->first();
        if (! $inventoryModel) {
            return null;
        }

        return $this->toDomain($inventoryModel);
    }

    public function save(Inventory $inventory): void
    {
        $values = [
            'stock_quantity' => $inventory->stockQuantity,
            'reserved_quantity' => $inventory->reservedQuantity,
            'updated_at' => now(),
        ];

        $updated = DB::table('inventory')
            ->where('product_id', $inventory->productId)
            ->where('pharmacy_id', $inventory->pharmacyId)
            ->update($values);

        if ($updated === 0) {
            DB::table('inventory')->insert([
                'product_id' => $inventory->productId,
                'pharmacy_id' => $inventory->pharmacyId,
                ...$values,
            ]);
        }
    }

    public function list(int $pharmacyId): array
    {
        return InventoryModel::where('pharmacy_id', $pharmacyId)
            ->get()
            ->map(fn ($model) => $this->toDomain($model))
            ->all();
    }

    private function toDomain(InventoryModel $inventoryModel): Inventory
    {
        return new Inventory(
            productId: $inventoryModel->product_id,
            pharmacyId: $inventoryModel->pharmacy_id,
            stockQuantity: $inventoryModel->stock_quantity,
            reservedQuantity: $inventoryModel->reserved_quantity,
            updatedAt: \DateTimeImmutable::createFromInterface($inventoryModel->updated_at)
        );
    }
}
