<?php

namespace App\Modules\Catalog\Domain;

use App\Shared\Domain\Entity;

class Category extends Entity
{
    public function __construct(
        public readonly int $id,
        public string $name,
        public ?string $description,
        public readonly int $sectionId,
    ) {}
}
