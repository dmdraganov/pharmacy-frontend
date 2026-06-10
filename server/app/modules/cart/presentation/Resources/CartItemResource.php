<?php

namespace App\Modules\Cart\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
        ];
    }
}
