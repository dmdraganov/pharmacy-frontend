<?php

namespace App\Modules\Cart\Domain;

interface CartItemRepositoryContract
{
    public function find(int $id): ?CartItem;

    public function findByProduct(string $userId, string $productId): ?CartItem;

    public function save(CartItem $cartItem): void;

    public function delete(CartItem $cartItem): void;

    public function list(string $userId): array;

    public function clear(string $userId): void;
}
