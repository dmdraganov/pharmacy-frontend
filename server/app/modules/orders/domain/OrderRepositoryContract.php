<?php

namespace App\Modules\Orders\Domain;

interface OrderRepositoryContract
{
    public function find(string $id): ?Order;

    public function save(Order $order): void;

    public function list(string $userId): array;

    public function listAll(): array;

    public function getStatusIdByCode(string $code): ?int;

    public function getStatusCodeById(int $id): ?string;

    public function getDeliveryMethodIdByCode(string $code): ?int;

    public function getDeliveryMethodCodeById(int $id): ?string;

    public function getPaymentMethodIdByCode(string $code): ?int;

    public function getPaymentMethodCodeById(int $id): ?string;
}
