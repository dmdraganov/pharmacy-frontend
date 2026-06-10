<?php

namespace App\Modules\Orders\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'status_id' => $this->statusId,
            'delivery_method_id' => $this->deliveryMethodId,
            'payment_method_id' => $this->paymentMethodId,
            'pharmacy_id' => $this->pharmacyId,
            'delivery_country' => $this->deliveryCountry,
            'delivery_city' => $this->deliveryCity,
            'delivery_street' => $this->deliveryStreet,
            'delivery_house' => $this->deliveryHouse,
            'delivery_apartment' => $this->deliveryApartment,
            'delivery_postal_code' => $this->deliveryPostalCode,
            'total_amount' => $this->totalPrice,
            'created_at' => $this->createdAt?->format(DATE_ATOM),
            'items' => OrderItemResource::collection($this->items),
        ];
    }
}
