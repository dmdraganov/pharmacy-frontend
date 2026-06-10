<?php

namespace App\Modules\Users\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => $this->createdAt?->format(DATE_ATOM),
            'updated_at' => $this->updatedAt?->format(DATE_ATOM),
            'roles' => $this->roles,
        ];
    }
}
