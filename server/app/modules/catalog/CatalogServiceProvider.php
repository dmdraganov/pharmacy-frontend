<?php

namespace App\Modules\Catalog;

use App\Modules\Catalog\Domain\AttributeRepositoryContract;
use App\Modules\Catalog\Domain\BrandRepositoryContract;
use App\Modules\Catalog\Domain\CategoryRepositoryContract;
use App\Modules\Catalog\Domain\ManufacturerRepositoryContract;
use App\Modules\Catalog\Domain\ProductAttributeRepositoryContract;
use App\Modules\Catalog\Domain\ProductImageRepositoryContract;
use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Modules\Catalog\Domain\SectionRepositoryContract;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\AttributeRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\BrandRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\CategoryRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\ManufacturerRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\ProductAttributeRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\ProductImageRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\ProductRepository;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\SectionRepository;
use Illuminate\Support\ServiceProvider;

class CatalogServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SectionRepositoryContract::class, SectionRepository::class);
        $this->app->bind(CategoryRepositoryContract::class, CategoryRepository::class);
        $this->app->bind(BrandRepositoryContract::class, BrandRepository::class);
        $this->app->bind(ManufacturerRepositoryContract::class, ManufacturerRepository::class);
        $this->app->bind(ProductRepositoryContract::class, ProductRepository::class);
        $this->app->bind(ProductImageRepositoryContract::class, ProductImageRepository::class);
        $this->app->bind(AttributeRepositoryContract::class, AttributeRepository::class);
        $this->app->bind(ProductAttributeRepositoryContract::class, ProductAttributeRepository::class);
    }
}
