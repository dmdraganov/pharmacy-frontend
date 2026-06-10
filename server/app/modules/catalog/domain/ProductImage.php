<?php

namespace App\Modules\Catalog\Domain;

use App\Shared\Domain\Entity;

class ProductImage extends Entity
{
    public function __construct(
        public readonly string $id,
        public readonly string $productId,
        public string $imageUrl,
        public ?string $altText,
        public int $sortOrder,
        public bool $isMain,
    ) {}
}
