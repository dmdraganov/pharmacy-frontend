<?php

namespace App\Modules\Users\Application\DTO;

use App\Shared\Application\DTO;

class RegisterUserDTO extends DTO
{
    public function __construct(
        public readonly string $firstName,
        public readonly ?string $lastName,
        public readonly string $email,
        public readonly ?string $phone,
        public readonly string $password,
    ) {}
}
