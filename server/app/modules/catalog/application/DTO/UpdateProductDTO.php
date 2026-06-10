<?php

namespace App\Modules\Catalog\Application\DTO;

use App\Shared\Application\DTO;

class UpdateProductDTO extends DTO
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $slug,
        public readonly ?string $description,
        public readonly float $price,
        public readonly ?float $oldPrice,
        public readonly bool $isPopular,
        public readonly bool $isPrescription,
        public readonly ?array $info,
        public readonly int $categoryId,
        public readonly int $brandId,
        public readonly int $manufacturerId,
        public readonly string $updatedBy,
    ) {}
}
