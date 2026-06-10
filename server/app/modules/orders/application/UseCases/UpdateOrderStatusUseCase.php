<?php

namespace App\Modules\Orders\Application\UseCases;

use App\Modules\Orders\Application\DTO\UpdateOrderStatusDTO;
use App\Modules\Orders\Domain\Order;
use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Shared\Application\UseCase;

class UpdateOrderStatusUseCase implements UseCase
{
    public function __construct(
        private readonly OrderRepositoryContract $orderRepository
    ) {}

    public function __invoke(UpdateOrderStatusDTO $data): Order
    {
        $order = $this->orderRepository->find($data->orderId);
        $order->statusId = $data->statusId;
        $order->updatedAt = new \DateTimeImmutable;

        $this->orderRepository->save($order);

        return $order;
    }
}
