<?php

namespace App\Modules\Orders\Application\DTO;

use App\Shared\Application\DTO;

class UpdateOrderStatusDTO extends DTO
{
    public function __construct(
        public readonly string $orderId,
        public readonly int $statusId,
    ) {}
}
