<?php

namespace App\Modules\Catalog\Domain;

interface ProductAttributeRepositoryContract
{
    public function find(string $productId, int $attributeId): ?ProductAttribute;

    public function save(ProductAttribute $productAttribute): void;

    public function delete(ProductAttribute $productAttribute): void;
}
