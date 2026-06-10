<?php

namespace App\Modules\Users\Domain;

interface UserRepositoryContract
{
    public function find(string $id): ?User;

    public function findByEmail(string $email): ?User;

    public function save(User $user): void;

    public function delete(User $user): void;
}
