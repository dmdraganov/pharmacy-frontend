<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\Attribute;
use App\Modules\Catalog\Domain\AttributeRepositoryContract;

class AttributeRepository implements AttributeRepositoryContract
{
    public function find(int $id): ?Attribute
    {
        $attributeModel = AttributeModel::find($id);
        if (! $attributeModel) {
            return null;
        }

        return $this->toDomain($attributeModel);
    }

    public function save(Attribute $attribute): void
    {
        $attributeModel = AttributeModel::find($attribute->id) ?? new AttributeModel;
        $attributeModel->id = $attribute->id;
        $attributeModel->name = $attribute->name;
        $attributeModel->save();
    }

    public function delete(Attribute $attribute): void
    {
        AttributeModel::destroy($attribute->id);
    }

    public function list(): array
    {
        return AttributeModel::all()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(AttributeModel $attributeModel): Attribute
    {
        return new Attribute(
            id: $attributeModel->id,
            name: $attributeModel->name
        );
    }
}
