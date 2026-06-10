<?php

namespace App\Modules\Favorites\Infrastructure\Persistence\Eloquent;

use App\Modules\Favorites\Domain\Favorite;
use App\Modules\Favorites\Domain\FavoriteRepositoryContract;

class FavoriteRepository implements FavoriteRepositoryContract
{
    public function find(string $userId, string $productId): ?Favorite
    {
        $favoriteModel = FavoriteModel::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
        if (! $favoriteModel) {
            return null;
        }

        return $this->toDomain($favoriteModel);
    }

    public function save(Favorite $favorite): void
    {
        FavoriteModel::updateOrCreate(
            ['user_id' => $favorite->userId, 'product_id' => $favorite->productId]
        );
    }

    public function delete(Favorite $favorite): void
    {
        FavoriteModel::where('user_id', $favorite->userId)
            ->where('product_id', $favorite->productId)
            ->delete();
    }

    public function list(string $userId): array
    {
        return FavoriteModel::where('user_id', $userId)
            ->get()
            ->map(fn ($model) => $this->toDomain($model))
            ->all();
    }

    private function toDomain(FavoriteModel $favoriteModel): Favorite
    {
        return new Favorite(
            userId: $favoriteModel->user_id,
            productId: $favoriteModel->product_id
        );
    }
}
