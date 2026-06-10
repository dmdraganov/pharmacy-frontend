<?php

namespace App\Modules\Catalog\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'is_popular' => 'boolean',
            'is_prescription' => 'boolean',
            'info' => 'nullable|array',
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'required|integer|exists:brands,id',
            'manufacturer_id' => 'required|integer|exists:manufacturers,id',
        ];
    }
}
