<?php

namespace App\Modules\Catalog\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadProductImageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'image' => 'required|image|max:2048',
            'alt_text' => 'nullable|string|max:255',
            'sort_order' => 'integer',
            'is_main' => 'boolean',
        ];
    }
}
