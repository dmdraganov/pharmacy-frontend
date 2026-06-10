<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\ManufacturerRepositoryContract;
use App\Shared\Application\UseCase;

class ListManufacturersUseCase implements UseCase
{
    public function __construct(
        private readonly ManufacturerRepositoryContract $manufacturerRepository
    ) {}

    public function __invoke(): array
    {
        return $this->manufacturerRepository->list();
    }
}
