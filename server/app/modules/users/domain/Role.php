<?php

namespace App\Modules\Users\Domain;

use App\Shared\Domain\Entity;

class Role extends Entity
{
    public const USER = 'USER';

    public const MANAGER = 'MANAGER';

    public const ADMIN = 'ADMIN';

    public function __construct(
        public readonly int $id,
        public readonly string $name
    ) {}
}
