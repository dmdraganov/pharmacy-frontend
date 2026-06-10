<?php

namespace App\Modules\Catalog\Application\DTO;

use App\Shared\Application\DTO;
use Illuminate\Http\UploadedFile;

class UploadProductImageDTO extends DTO
{
    public function __construct(
        public readonly string $productId,
        public readonly UploadedFile $image,
        public readonly ?string $altText,
        public readonly int $sortOrder,
        public readonly bool $isMain,
    ) {}
}
