<?php

namespace App\Modules\Search;

use App\Modules\Catalog\Domain\Events\ProductCreated;
use App\Modules\Catalog\Domain\Events\ProductDeleted;
use App\Modules\Catalog\Domain\Events\ProductUpdated;
use App\Modules\Search\Application\Listeners\IndexProduct;
use App\Modules\Search\Application\Listeners\RemoveProductFromIndex;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class SearchServiceProvider extends ServiceProvider
{
    protected $listen = [
        ProductCreated::class => [
            IndexProduct::class,
        ],
        ProductUpdated::class => [
            IndexProduct::class,
        ],
        ProductDeleted::class => [
            RemoveProductFromIndex::class,
        ],
    ];

    public function register(): void
    {
        //
    }
}
