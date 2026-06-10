<?php

namespace App\Modules\Users\Domain;

use App\Shared\Domain\Entity;

class User extends Entity
{
    public function __construct(
        public readonly string $id,
        public string $firstName,
        public ?string $lastName,
        public string $email,
        public ?string $phone,
        public string $password,
        public readonly \DateTimeImmutable $createdAt,
        public \DateTimeImmutable $updatedAt,
        /** @var Role[] */
        public array $roles = []
    ) {}
}
