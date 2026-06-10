<?php

namespace App\Modules\Orders\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'product_id' => $this->productId,
            'quantity' => $this->quantity,
            'price' => $this->price,
        ];
    }
}
