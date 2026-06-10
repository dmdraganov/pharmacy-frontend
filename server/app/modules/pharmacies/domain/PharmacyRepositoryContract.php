<?php

namespace App\Modules\Pharmacies\Domain;

interface PharmacyRepositoryContract
{
    public function find(int $id): ?Pharmacy;

    public function save(Pharmacy $pharmacy): void;

    public function delete(Pharmacy $pharmacy): void;

    public function list(): array;
}
