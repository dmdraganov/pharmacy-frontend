<?php

namespace App\Modules\Favorites\Application\UseCases;

use App\Modules\Favorites\Domain\Favorite;
use App\Modules\Favorites\Domain\FavoriteRepositoryContract;
use App\Shared\Application\UseCase;

class RemoveFromFavoritesUseCase implements UseCase
{
    public function __construct(
        private readonly FavoriteRepositoryContract $favoriteRepository
    ) {}

    public function __invoke(string $userId, string $productId): void
    {
        $favorite = new Favorite($userId, $productId);
        $this->favoriteRepository->delete($favorite);
    }
}
