<?php

namespace App\Modules\Catalog\Domain;

use App\Shared\Domain\Entity;

class Product extends Entity
{
    public function __construct(
        public readonly string $id,
        public string $name,
        public string $slug,
        public ?string $description,
        public float $price,
        public ?float $oldPrice,
        public bool $isPopular,
        public bool $isPrescription,
        public ?array $info,
        public int $categoryId,
        public int $brandId,
        public int $manufacturerId,
        public readonly ?string $createdBy,
        public ?string $updatedBy,
        public readonly \DateTimeImmutable $createdAt,
        public \DateTimeImmutable $updatedAt,
        /** @var ProductImage[] */
        public array $images = [],
    ) {}
}
