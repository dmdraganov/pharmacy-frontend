<?php

namespace App\Modules\Pharmacies\Infrastructure\Persistence\Eloquent;

use App\Modules\Pharmacies\Domain\Pharmacy;
use App\Modules\Pharmacies\Domain\PharmacyRepositoryContract;

class PharmacyRepository implements PharmacyRepositoryContract
{
    public function find(int $id): ?Pharmacy
    {
        $pharmacyModel = PharmacyModel::find($id);
        if (! $pharmacyModel) {
            return null;
        }

        return $this->toDomain($pharmacyModel);
    }

    public function save(Pharmacy $pharmacy): void
    {
        $pharmacyModel = PharmacyModel::find($pharmacy->id) ?? new PharmacyModel;
        $pharmacyModel->id = $pharmacy->id;
        $pharmacyModel->name = $pharmacy->name;
        $pharmacyModel->address = $pharmacy->address;
        $pharmacyModel->working_hours = $pharmacy->workingHours;
        $pharmacyModel->save();
    }

    public function delete(Pharmacy $pharmacy): void
    {
        PharmacyModel::destroy($pharmacy->id);
    }

    public function list(): array
    {
        return PharmacyModel::all()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(PharmacyModel $pharmacyModel): Pharmacy
    {
        return new Pharmacy(
            id: $pharmacyModel->id,
            name: $pharmacyModel->name,
            address: $pharmacyModel->address,
            workingHours: $pharmacyModel->working_hours
        );
    }
}
