<?php

namespace App\Modules\Inventory\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'product_id' => $this->productId,
            'pharmacy_id' => $this->pharmacyId,
            'stock_quantity' => $this->stockQuantity,
            'reserved_quantity' => $this->reservedQuantity,
            'updated_at' => $this->updatedAt?->format(DATE_ATOM),
        ];
    }
}
