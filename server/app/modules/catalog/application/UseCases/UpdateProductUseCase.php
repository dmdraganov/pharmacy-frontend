<?php

namespace App\Modules\Catalog\Application\UseCases;

use App\Modules\Catalog\Application\DTO\UpdateProductDTO;
use App\Modules\Catalog\Domain\Product;
use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Shared\Application\UseCase;

class UpdateProductUseCase implements UseCase
{
    public function __construct(
        private readonly ProductRepositoryContract $productRepository
    ) {}

    public function __invoke(UpdateProductDTO $data): Product
    {
        $product = $this->productRepository->find($data->id);

        $product->name = $data->name;
        $product->slug = $data->slug;
        $product->description = $data->description;
        $product->price = $data->price;
        $product->oldPrice = $data->oldPrice;
        $product->isPopular = $data->isPopular;
        $product->isPrescription = $data->isPrescription;
        $product->info = $data->info;
        $product->categoryId = $data->categoryId;
        $product->brandId = $data->brandId;
        $product->manufacturerId = $data->manufacturerId;
        $product->updatedBy = $data->updatedBy;
        $product->updatedAt = new \DateTimeImmutable;

        $this->productRepository->save($product);

        return $product;
    }
}
