<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\BrandRepositoryContract;
use App\Shared\Application\UseCase;

class ListBrandsUseCase implements UseCase
{
    public function __construct(
        private readonly BrandRepositoryContract $brandRepository
    ) {}

    public function __invoke(): array
    {
        return $this->brandRepository->list();
    }
}
