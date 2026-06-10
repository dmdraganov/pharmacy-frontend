<?php

namespace App\Modules\Inventory\Application\DTO;

use App\Shared\Application\DTO;

class UpdateInventoryDTO extends DTO
{
    public function __construct(
        public readonly string $productId,
        public readonly int $pharmacyId,
        public readonly int $stockQuantity,
    ) {}
}
