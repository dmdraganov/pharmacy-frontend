<?php

namespace App\Modules\Catalog\Domain;

interface ProductImageRepositoryContract
{
    public function find(string $id): ?ProductImage;

    public function save(ProductImage $productImage): void;

    public function delete(ProductImage $productImage): void;
}
