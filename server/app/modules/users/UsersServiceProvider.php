<?php

namespace App\Modules\Users;

use App\Modules\Users\Domain\RoleRepositoryContract;
use App\Modules\Users\Domain\UserRepositoryContract;
use App\Modules\Users\Infrastructure\Persistence\Eloquent\RoleRepository;
use App\Modules\Users\Infrastructure\Persistence\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class UsersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryContract::class, UserRepository::class);
        $this->app->bind(RoleRepositoryContract::class, RoleRepository::class);
    }
}
