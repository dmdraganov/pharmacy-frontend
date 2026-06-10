<?php

namespace App\Modules\Pharmacies\Application\UseCases;

use App\Modules\Pharmacies\Domain\PharmacyRepositoryContract;
use App\Shared\Application\UseCase;

class ListPharmaciesUseCase implements UseCase
{
    public function __construct(
        private readonly PharmacyRepositoryContract $pharmacyRepository
    ) {}

    public function __invoke(): array
    {
        return $this->pharmacyRepository->list();
    }
}
