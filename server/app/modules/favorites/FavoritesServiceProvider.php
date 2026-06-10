<?php

namespace App\Modules\Favorites;

use App\Modules\Favorites\Domain\FavoriteRepositoryContract;
use App\Modules\Favorites\Infrastructure\Persistence\Eloquent\FavoriteRepository;
use Illuminate\Support\ServiceProvider;

class FavoritesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(FavoriteRepositoryContract::class, FavoriteRepository::class);
    }
}
