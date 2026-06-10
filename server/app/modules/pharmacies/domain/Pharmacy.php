<?php

namespace App\Modules\Pharmacies\Domain;

use App\Shared\Domain\Entity;

class Pharmacy extends Entity
{
    public function __construct(
        public readonly int $id,
        public string $name,
        public string $address,
        public ?string $workingHours,
    ) {}
}
