<?php

namespace App\Modules\Users\Application\DTO;

use App\Shared\Application\DTO;

class UpdateProfileDTO extends DTO
{
    public function __construct(
        public readonly string $userId,
        public readonly string $firstName,
        public readonly ?string $lastName,
        public readonly ?string $phone,
    ) {}
}
