<?php

namespace App\Modules\Users\Domain;

interface RoleRepositoryContract
{
    public function find(int $id): ?Role;

    public function findByName(string $name): ?Role;
}
