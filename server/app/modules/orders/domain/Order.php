<?php

namespace App\Modules\Orders\Domain;

use App\Shared\Domain\Entity;

class Order extends Entity
{
    public function __construct(
        public readonly string $id,
        public readonly string $userId,
        public int $statusId,
        public int $deliveryMethodId,
        public int $paymentMethodId,
        public ?int $pharmacyId,
        public ?string $deliveryCountry,
        public ?string $deliveryCity,
        public ?string $deliveryStreet,
        public ?string $deliveryHouse,
        public ?string $deliveryApartment,
        public ?string $deliveryPostalCode,
        public float $totalPrice,
        public readonly \DateTimeImmutable $createdAt,
        public \DateTimeImmutable $updatedAt,
        /** @var OrderItem[] */
        public array $items = []
    ) {}
}
