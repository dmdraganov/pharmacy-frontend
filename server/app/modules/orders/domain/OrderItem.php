<?php

namespace App\Modules\Orders\Domain;

use App\Shared\Domain\Entity;

class OrderItem extends Entity
{
    public function __construct(
        public readonly int $id,
        public readonly string $orderId,
        public readonly string $productId,
        public int $quantity,
        public float $price,
    ) {}
}
