<?php

namespace App\Modules\Favorites\Domain;

use App\Shared\Domain\Entity;

class Favorite extends Entity
{
    public function __construct(
        public readonly string $userId,
        public readonly string $productId,
    ) {}
}
