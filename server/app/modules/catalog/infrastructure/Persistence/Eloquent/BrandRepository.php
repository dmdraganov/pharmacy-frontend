<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\Brand;
use App\Modules\Catalog\Domain\BrandRepositoryContract;

class BrandRepository implements BrandRepositoryContract
{
    public function find(int $id): ?Brand
    {
        $brandModel = BrandModel::find($id);
        if (! $brandModel) {
            return null;
        }

        return $this->toDomain($brandModel);
    }

    public function save(Brand $brand): void
    {
        $brandModel = BrandModel::find($brand->id) ?? new BrandModel;
        $brandModel->id = $brand->id;
        $brandModel->name = $brand->name;
        $brandModel->save();
    }

    public function delete(Brand $brand): void
    {
        BrandModel::destroy($brand->id);
    }

    public function list(): array
    {
        return BrandModel::all()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(BrandModel $brandModel): Brand
    {
        return new Brand(
            id: $brandModel->id,
            name: $brandModel->name
        );
    }
}
