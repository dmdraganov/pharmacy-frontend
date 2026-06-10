<?php

namespace App\Modules\Users\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
        ];
    }
}
