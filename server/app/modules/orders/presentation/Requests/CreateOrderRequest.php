<?php

namespace App\Modules\Orders\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'delivery_method_code' => 'required|string|exists:delivery_methods,code',
            'payment_method_code' => 'required|string|exists:payment_methods,code',
            'pharmacy_id' => 'nullable|integer|exists:pharmacies,id',
            'delivery_country' => 'nullable|string|max:255',
            'delivery_city' => 'nullable|string|max:255',
            'delivery_street' => 'nullable|string|max:255',
            'delivery_house' => 'nullable|string|max:50',
            'delivery_apartment' => 'nullable|string|max:50',
            'delivery_postal_code' => 'nullable|string|max:50',
            'items' => 'required|array',
            'items.*.product_id' => 'required|string|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }
}
