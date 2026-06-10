<?php

namespace App\Modules\Orders;

use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Modules\Orders\Infrastructure\Persistence\Eloquent\OrderRepository;
use Illuminate\Support\ServiceProvider;

class OrdersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(OrderRepositoryContract::class, OrderRepository::class);
    }
}
