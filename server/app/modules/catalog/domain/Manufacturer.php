<?php

namespace App\Modules\Catalog\Domain;

use App\Shared\Domain\Entity;

class Manufacturer extends Entity
{
    public function __construct(
        public readonly int $id,
        public string $name,
        public ?string $country,
    ) {}
}
