<?php

namespace App\Modules\Catalog\Domain;

interface ManufacturerRepositoryContract
{
    public function find(int $id): ?Manufacturer;

    public function save(Manufacturer $manufacturer): void;

    public function delete(Manufacturer $manufacturer): void;

    public function list(): array;
}
