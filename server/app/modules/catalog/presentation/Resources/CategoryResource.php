<?php

namespace App\Modules\Catalog\Presentation\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'section_id' => $this->sectionId,
        ];
    }
}
