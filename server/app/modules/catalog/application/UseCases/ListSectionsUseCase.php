<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\SectionRepositoryContract;
use App\Shared\Application\UseCase;

class ListSectionsUseCase implements UseCase
{
    public function __construct(
        private readonly SectionRepositoryContract $sectionRepository
    ) {}

    public function __invoke(): array
    {
        return $this->sectionRepository->list();
    }
}
