<?php

namespace App\Modules\Cart\Domain;

use App\Shared\Domain\Entity;

class CartItem extends Entity
{
    public function __construct(
        public readonly int $id,
        public readonly string $userId,
        public readonly string $productId,
        public int $quantity,
    ) {}
}
