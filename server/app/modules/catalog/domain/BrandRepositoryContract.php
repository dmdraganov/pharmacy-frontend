<?php

namespace App\Modules\Catalog\Domain;

interface BrandRepositoryContract
{
    public function find(int $id): ?Brand;

    public function save(Brand $brand): void;

    public function delete(Brand $brand): void;

    public function list(): array;
}
