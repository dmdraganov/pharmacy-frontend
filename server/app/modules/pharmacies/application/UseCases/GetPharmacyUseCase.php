<?php

namespace App\Modules\Pharmacies\Application\UseCases;

use App\Modules\Pharmacies\Domain\Pharmacy;
use App\Modules\Pharmacies\Domain\PharmacyRepositoryContract;
use App\Shared\Application\UseCase;

class GetPharmacyUseCase implements UseCase
{
    public function __construct(
        private readonly PharmacyRepositoryContract $pharmacyRepository
    ) {}

    public function __invoke(int $id): ?Pharmacy
    {
        return $this->pharmacyRepository->find($id);
    }
}
