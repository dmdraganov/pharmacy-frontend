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
        if (! $productImage) {
            return;
        }

        $path = ltrim(parse_url($productImage->imageUrl, PHP_URL_PATH) ?? '', '/');
        $path = str_starts_with($path, 'storage/') ? substr($path, strlen('storage/')) : $path;

        Storage::disk('public')->delete($path);

        $this->productImageRepository->delete($productImage);
    }
}
