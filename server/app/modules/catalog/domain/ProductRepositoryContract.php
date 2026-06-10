<?php

namespace App\Modules\Catalog\Domain;

interface ProductRepositoryContract
{
    public function find(string $id): ?Product;

    public function save(Product $product): void;

    public function delete(Product $product): void;

    public function list(array $criteria = []): array;

    public function listByPharmacy(int $pharmacyId, array $criteria = []): array;
}
