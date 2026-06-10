<?php

namespace App\Modules\Catalog\Domain;

use App\Shared\Domain\Entity;

class Brand extends Entity
{
    public function __construct(
        public readonly int $id,
        public string $name,
    ) {}
}
