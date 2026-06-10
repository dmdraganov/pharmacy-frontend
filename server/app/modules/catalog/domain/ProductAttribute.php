<?php

namespace App\Modules\Catalog\Domain;

use App\Shared\Domain\Entity;

class ProductAttribute extends Entity
{
    public function __construct(
        public readonly string $productId,
        public readonly int $attributeId,
        public string $value,
    ) {}
}
