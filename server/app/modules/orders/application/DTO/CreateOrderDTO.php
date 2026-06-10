<?php

namespace App\Modules\Orders\Application\DTO;

use App\Shared\Application\DTO;

class CreateOrderDTO extends DTO
{
    /**
     * @param  array<int, array{product_id: string, quantity: int}>  $items
     */
    public function __construct(
        public readonly string $userId,
        public readonly int $deliveryMethodId,
        public readonly int $paymentMethodId,
        public readonly ?int $pharmacyId,
        public readonly ?string $deliveryCountry,
        public readonly ?string $deliveryCity,
        public readonly ?string $deliveryStreet,
        public readonly ?string $deliveryHouse,
        public readonly ?string $deliveryApartment,
        public readonly ?string $deliveryPostalCode,
        public readonly array $items,
    ) {}
}
