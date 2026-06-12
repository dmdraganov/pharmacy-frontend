<?php

namespace App\Modules\Catalog\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        $images = $this->images ?? [];
        $mainImage = collect($images)
            ->sortBy([
                ['isMain', 'desc'],
                ['sortOrder', 'asc'],
            ])
            ->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'old_price' => $this->oldPrice,
            'is_popular' => $this->isPopular,
            'is_prescription' => $this->isPrescription,
            'info' => $this->info,
            'image' => $mainImage?->imageUrl,
            'images' => ProductImageResource::collection($images),
            'category_id' => $this->categoryId,
            'brand_id' => $this->brandId,
            'manufacturer_id' => $this->manufacturerId,
            'created_at' => $this->createdAt?->format(DATE_ATOM),
            'updated_at' => $this->updatedAt?->format(DATE_ATOM),
        ];
    }
}
