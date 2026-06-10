<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\Section;
use App\Modules\Catalog\Domain\SectionRepositoryContract;

class SectionRepository implements SectionRepositoryContract
{
    public function find(int $id): ?Section
    {
        $sectionModel = SectionModel::find($id);
        if (! $sectionModel) {
            return null;
        }

        return $this->toDomain($sectionModel);
    }

    public function save(Section $section): void
    {
        $sectionModel = SectionModel::find($section->id) ?? new SectionModel;
        $sectionModel->id = $section->id;
        $sectionModel->name = $section->name;
        $sectionModel->description = $section->description;
        $sectionModel->save();
    }

    public function delete(Section $section): void
    {
        SectionModel::destroy($section->id);
    }

    public function list(): array
    {
        return SectionModel::all()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(SectionModel $sectionModel): Section
    {
        return new Section(
            id: $sectionModel->id,
            name: $sectionModel->name,
            description: $sectionModel->description
        );
    }
}
