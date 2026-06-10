<?php

namespace App\Modules\Users\Application\DTO;

use App\Shared\Application\DTO;

class LoginDTO extends DTO
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
    ) {}
}
