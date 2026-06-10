<?php

namespace App\Modules\Pharmacies;

use App\Modules\Pharmacies\Domain\PharmacyRepositoryContract;
use App\Modules\Pharmacies\Infrastructure\Persistence\Eloquent\PharmacyRepository;
use Illuminate\Support\ServiceProvider;

class PharmaciesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PharmacyRepositoryContract::class, PharmacyRepository::class);
    }
}
