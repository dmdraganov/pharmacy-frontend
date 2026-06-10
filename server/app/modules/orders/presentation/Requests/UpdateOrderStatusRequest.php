<?php

namespace App\Modules\Orders\Presentation\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status_id' => 'required|integer|exists:order_statuses,id',
        ];
    }
}
