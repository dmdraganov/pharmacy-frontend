<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Domain\ProductImageRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Support\Facades\Storage;

class DeleteProductImageUseCase implements UseCase
{
    public function __construct(
        private readonly ProductImageRepositoryContract $productImageRepository
    ) {}

    public function __invoke(string $id): void
    {
        $productImage = $this->productImageRepository->find($id);

        Storage::disk('s3')->delete($productImage->imageUrl);

        $this->productImageRepository->delete($productImage);
    }
}
