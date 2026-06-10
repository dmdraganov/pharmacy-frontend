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
        public readonly int $categoryId,
        public readonly int $brandId,
        public readonly int $manufacturerId,
        public readonly string $createdBy,
        public string $updatedBy,
        public readonly \DateTimeImmutable $createdAt,
        public \DateTimeImmutable $updatedAt,
    ) {}
}
