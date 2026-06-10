<?php

namespace App\Modules\Favorites\Domain;

interface FavoriteRepositoryContract
{
    public function find(string $userId, string $productId): ?Favorite;

    public function save(Favorite $favorite): void;

    public function delete(Favorite $favorite): void;

    public function list(string $userId): array;
}
