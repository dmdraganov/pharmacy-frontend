<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Application\DTO\CreateProductDTO;
use App\Modules\Catalog\Domain\Product;
use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Support\Str;

class CreateProductUseCase implements UseCase
{
    public function __construct(
        private readonly ProductRepositoryContract $productRepository
    ) {}

    public function __invoke(CreateProductDTO $data): Product
    {
        $product = new Product(
            id: Str::uuid()->toString(),
            name: $data->name,
            slug: $data->slug,
            description: $data->description,
            price: $data->price,
            oldPrice: $data->oldPrice,
            isPopular: $data->isPopular,
            isPrescription: $data->isPrescription,
            info: $data->info,
            categoryId: $data->categoryId,
            brandId: $data->brandId,
            manufacturerId: $data->manufacturerId,
            createdBy: $data->createdBy,
            updatedBy: $data->createdBy,
            createdAt: new \DateTimeImmutable,
            updatedAt: new \DateTimeImmutable
        );

        $this->productRepository->save($product);

        return $this->productRepository->find($product->id) ?? $product;
    }
}
