<?php

namespace App\Modules\Orders\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class OrderResource extends JsonResource
{
    private static ?array $deliveryMethodCodes = null;

    private static ?array $paymentMethodCodes = null;

    public function toArray($request): array
    {
        self::$deliveryMethodCodes ??= DB::table('delivery_methods')->pluck('code', 'id')->all();
        self::$paymentMethodCodes ??= DB::table('payment_methods')->pluck('code', 'id')->all();

        return [
            'id' => $this->id,
            'status_id' => $this->statusId,
            'delivery_method_id' => $this->deliveryMethodId,
            'delivery_method_code' => self::$deliveryMethodCodes[$this->deliveryMethodId] ?? null,
            'payment_method_id' => $this->paymentMethodId,
            'payment_method_code' => self::$paymentMethodCodes[$this->paymentMethodId] ?? null,
            'pharmacy_id' => $this->pharmacyId,
            'delivery_country' => $this->deliveryCountry,
            'delivery_city' => $this->deliveryCity,
            'delivery_street' => $this->deliveryStreet,
            'delivery_house' => $this->deliveryHouse,
            'delivery_apartment' => $this->deliveryApartment,
            'delivery_postal_code' => $this->deliveryPostalCode,
            'total_amount' => $this->totalPrice,
            'created_at' => $this->createdAt?->format(DATE_ATOM),
            'user' => $this->customer ? [
                'id' => $this->customer->id,
                'first_name' => $this->customer->firstName,
                'last_name' => $this->customer->lastName,
                'email' => $this->customer->email,
                'phone' => $this->customer->phone,
            ] : null,
            'items' => OrderItemResource::collection($this->items),
        ];
    }
}
