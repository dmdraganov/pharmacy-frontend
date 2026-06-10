<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\ProductImage;
use App\Modules\Catalog\Domain\ProductImageRepositoryContract;

class ProductImageRepository implements ProductImageRepositoryContract
{
    public function find(string $id): ?ProductImage
    {
        $productImageModel = ProductImageModel::find($id);
        if (! $productImageModel) {
            return null;
        }

        return $this->toDomain($productImageModel);
    }

    public function save(ProductImage $productImage): void
    {
        $productImageModel = ProductImageModel::find($productImage->id) ?? new ProductImageModel;
        $productImageModel->id = $productImage->id;
        $productImageModel->product_id = $productImage->productId;
        $productImageModel->image_url = $productImage->imageUrl;
        $productImageModel->alt_text = $productImage->altText;
        $productImageModel->sort_order = $productImage->sortOrder;
        $productImageModel->is_main = $productImage->isMain;
        $productImageModel->save();
    }

    public function delete(ProductImage $productImage): void
    {
        ProductImageModel::destroy($productImage->id);
    }

    private function toDomain(ProductImageModel $productImageModel): ProductImage
    {
        return new ProductImage(
            id: $productImageModel->id,
            productId: $productImageModel->product_id,
            imageUrl: $productImageModel->image_url,
            altText: $productImageModel->alt_text,
            sortOrder: $productImageModel->sort_order,
            isMain: $productImageModel->is_main
        );
    }
}
