<?php

namespace App\Modules\Orders\Domain;

interface OrderRepositoryContract
{
    public function find(string $id): ?Order;

    public function save(Order $order): void;

    public function list(string $userId): array;

    public function listAll(): array;

    public function getStatusIdByCode(string $code): ?int;
}
