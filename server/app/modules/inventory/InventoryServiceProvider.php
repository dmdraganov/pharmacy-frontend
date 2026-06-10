<?php

namespace App\Modules\Inventory;

use App\Modules\Inventory\Domain\InventoryRepositoryContract;
use App\Modules\Inventory\Infrastructure\Persistence\Eloquent\InventoryRepository;
use Illuminate\Support\ServiceProvider;

class InventoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(InventoryRepositoryContract::class, InventoryRepository::class);
    }
}
