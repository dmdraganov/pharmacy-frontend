<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\ProductAttribute;
use App\Modules\Catalog\Domain\ProductAttributeRepositoryContract;

class ProductAttributeRepository implements ProductAttributeRepositoryContract
{
    public function find(string $productId, int $attributeId): ?ProductAttribute
    {
        $productAttributeModel = ProductAttributeModel::where('product_id', $productId)
            ->where('attribute_id', $attributeId)
            ->first();

        if (! $productAttributeModel) {
            return null;
        }

        return $this->toDomain($productAttributeModel);
    }

    public function save(ProductAttribute $productAttribute): void
    {
        ProductAttributeModel::updateOrCreate(
            ['product_id' => $productAttribute->productId, 'attribute_id' => $productAttribute->attributeId],
            ['value' => $productAttribute->value]
        );
    }

    public function delete(ProductAttribute $productAttribute): void
    {
        ProductAttributeModel::where('product_id', $productAttribute->productId)
            ->where('attribute_id', $productAttribute->attributeId)
            ->delete();
    }

    private function toDomain(ProductAttributeModel $productAttributeModel): ProductAttribute
    {
        return new ProductAttribute(
            productId: $productAttributeModel->product_id,
            attributeId: $productAttributeModel->attribute_id,
            value: $productAttributeModel->value
        );
    }
}
