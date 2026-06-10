<?php

namespace App\Modules\Catalog\Domain;

interface AttributeRepositoryContract
{
    public function find(int $id): ?Attribute;

    public function save(Attribute $attribute): void;

    public function delete(Attribute $attribute): void;

    public function list(): array;
}
