<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Application\DTO\UploadProductImageDTO;
use App\Modules\Catalog\Domain\ProductImage;
use App\Modules\Catalog\Domain\ProductImageRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadProductImageUseCase implements UseCase
{
    public function __construct(
        private readonly ProductImageRepositoryContract $productImageRepository
    ) {}

    public function __invoke(UploadProductImageDTO $data): ProductImage
    {
        $path = $data->image->store('products', 'public');

        $productImage = new ProductImage(
            id: Str::uuid()->toString(),
            productId: $data->productId,
            imageUrl: Storage::disk('public')->url($path),
            altText: $data->altText,
            sortOrder: $data->sortOrder,
            isMain: $data->isMain,
        );

        $this->productImageRepository->save($productImage);

        return $productImage;
    }
}
