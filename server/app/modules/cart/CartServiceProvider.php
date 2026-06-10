<?php

namespace App\Modules\Cart;

use App\Modules\Cart\Domain\CartItemRepositoryContract;
use App\Modules\Cart\Infrastructure\Persistence\Eloquent\CartItemRepository;
use Illuminate\Support\ServiceProvider;

class CartServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CartItemRepositoryContract::class, CartItemRepository::class);
    }
}
