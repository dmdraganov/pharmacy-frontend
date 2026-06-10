<?php

namespace App\Modules\Catalog\Domain;

interface SectionRepositoryContract
{
    public function find(int $id): ?Section;

    public function save(Section $section): void;

    public function delete(Section $section): void;

    public function list(): array;
}
