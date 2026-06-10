<?php

namespace App\Modules\Favorites\Application\UseCases;

use App\Modules\Favorites\Domain\FavoriteRepositoryContract;
use App\Shared\Application\UseCase;

class ListFavoritesUseCase implements UseCase
{
    public function __construct(
        private readonly FavoriteRepositoryContract $favoriteRepository
    ) {}

    public function __invoke(string $userId): array
    {
        return $this->favoriteRepository->list($userId);
    }
}
