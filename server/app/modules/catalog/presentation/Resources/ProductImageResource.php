<?php

namespace App\Modules\Catalog\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->productId,
            'image_url' => $this->imageUrl,
            'alt_text' => $this->altText,
            'sort_order' => $this->sortOrder,
            'is_main' => $this->isMain,
        ];
    }
}
