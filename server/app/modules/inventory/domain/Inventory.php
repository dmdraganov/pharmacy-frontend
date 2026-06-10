<?php

namespace App\Modules\Inventory\Domain;

use App\Shared\Domain\Entity;

class Inventory extends Entity
{
    public function __construct(
        public readonly string $productId,
        public readonly int $pharmacyId,
        public int $stockQuantity,
        public int $reservedQuantity,
        public readonly \DateTimeImmutable $updatedAt,
    ) {}
}
