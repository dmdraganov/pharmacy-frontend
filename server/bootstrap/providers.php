<?php

use App\Modules\Cart\CartServiceProvider;
use App\Modules\Catalog\CatalogServiceProvider;
use App\Modules\Favorites\FavoritesServiceProvider;
use App\Modules\Inventory\InventoryServiceProvider;
use App\Modules\Orders\OrdersServiceProvider;
use App\Modules\Pharmacies\PharmaciesServiceProvider;
use App\Modules\Search\SearchServiceProvider;
use App\Modules\Users\UsersServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\ElasticsearchServiceProvider;

return [
    AppServiceProvider::class,
    ElasticsearchServiceProvider::class,
    UsersServiceProvider::class,
    CatalogServiceProvider::class,
    PharmaciesServiceProvider::class,
    InventoryServiceProvider::class,
    SearchServiceProvider::class,
    FavoritesServiceProvider::class,
    CartServiceProvider::class,
    OrdersServiceProvider::class,
];
