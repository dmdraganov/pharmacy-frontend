<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use App\Modules\Catalog\Domain\Events\ProductCreated;
use App\Modules\Catalog\Domain\Events\ProductDeleted;
use App\Modules\Catalog\Domain\Events\ProductUpdated;
use App\Modules\Catalog\Domain\Product;
use App\Modules\Catalog\Domain\ProductRepositoryContract;
use Illuminate\Support\Facades\Event;

class ProductRepository implements ProductRepositoryContract
{
    public function find(string $id): ?Product
    {
        $productModel = ProductModel::find($id);
        if (! $productModel) {
            return null;
        }

        return $this->toDomain($productModel);
    }

    public function save(Product $product): void
    {
        $productModel = ProductModel::find($product->id) ?? new ProductModel;
        $isNew = ! $productModel->exists;

        $productModel->id = $product->id;
        $productModel->name = $product->name;
        $productModel->slug = $product->slug;
        $productModel->description = $product->description;
        $productModel->price = $product->price;
        $productModel->old_price = $product->oldPrice;
        $productModel->is_popular = $product->isPopular;
        $productModel->is_prescription = $product->isPrescription;
        $productModel->info = $product->info;
        $productModel->category_id = $product->categoryId;
        $productModel->brand_id = $product->brandId;
        $productModel->manufacturer_id = $product->manufacturerId;
        $productModel->created_by = $product->createdBy;
        $productModel->updated_by = $product->updatedBy;
        $productModel->save();

        if ($isNew) {
            Event::dispatch(new ProductCreated($this->toDomain($productModel)));
        } else {
            Event::dispatch(new ProductUpdated($this->toDomain($productModel)));
        }
    }

    public function delete(Product $product): void
    {
        ProductModel::destroy($product->id);
        Event::dispatch(new ProductDeleted($product));
    }

    public function list(array $criteria = []): array
    {
        $query = ProductModel::query();

        foreach (['category_id', 'brand_id', 'manufacturer_id'] as $field) {
            if (array_key_exists($field, $criteria) && $criteria[$field] !== null && $criteria[$field] !== '') {
                $query->where($field, $criteria[$field]);
            }
        }

        if (array_key_exists('is_popular', $criteria)) {
            $query->where('is_popular', filter_var($criteria['is_popular'], FILTER_VALIDATE_BOOLEAN));
        }

        if (array_key_exists('is_prescription', $criteria) && $criteria['is_prescription'] !== null && $criteria['is_prescription'] !== '') {
            $query->where('is_prescription', filter_var($criteria['is_prescription'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($criteria['min_price'])) {
            $query->where('price', '>=', $criteria['min_price']);
        }

        if (! empty($criteria['max_price'])) {
            $query->where('price', '<=', $criteria['max_price']);
        }

        match ($criteria['sort'] ?? null) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->latest(),
            default => $query->orderBy('name'),
        };

        return $query->get()->map(fn ($model) => $this->toDomain($model))->all();
    }

    private function toDomain(ProductModel $productModel): Product
    {
        return new Product(
            id: $productModel->id,
            name: $productModel->name,
            slug: $productModel->slug,
            description: $productModel->description,
            price: $productModel->price,
            oldPrice: $productModel->old_price,
            isPopular: $productModel->is_popular,
            isPrescription: $productModel->is_prescription,
            info: $productModel->info,
            categoryId: $productModel->category_id,
            brandId: $productModel->brand_id,
            manufacturerId: $productModel->manufacturer_id,
            createdBy: $productModel->created_by,
            updatedBy: $productModel->updated_by,
            createdAt: \DateTimeImmutable::createFromInterface($productModel->created_at),
            updatedAt: \DateTimeImmutable::createFromInterface($productModel->updated_at)
        );
    }
}
