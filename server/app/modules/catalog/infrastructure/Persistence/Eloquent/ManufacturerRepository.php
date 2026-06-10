<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\Manufacturer;
use App\Modules\Catalog\Domain\ManufacturerRepositoryContract;

class ManufacturerRepository implements ManufacturerRepositoryContract
{
    public function find(int $id): ?Manufacturer
    {
        $manufacturerModel = ManufacturerModel::find($id);
        if (! $manufacturerModel) {
            return null;
        }

        return $this->toDomain($manufacturerModel);
    }

    public function save(Manufacturer $manufacturer): void
    {
        $manufacturerModel = ManufacturerModel::find($manufacturer->id) ?? new ManufacturerModel;
        $manufacturerModel->id = $manufacturer->id;
        $manufacturerModel->name = $manufacturer->name;
        $manufacturerModel->country = $manufacturer->country;
        $manufacturerModel->save();
    }

    public function delete(Manufacturer $manufacturer): void
    {
        ManufacturerModel::destroy($manufacturer->id);
    }

    public function list(): array
    {
        return ManufacturerModel::all()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(ManufacturerModel $manufacturerModel): Manufacturer
    {
        return new Manufacturer(
            id: $manufacturerModel->id,
            name: $manufacturerModel->name,
            country: $manufacturerModel->country
        );
    }
}
