<?php

namespace App\Modules\Pharmacies\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PharmacyResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'working_hours' => $this->workingHours,
        ];
    }
}
