<?php

namespace App\Modules\Orders\Application\UseCases;

use App\Modules\Orders\Domain\Order;
use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Validation\ValidationException;

class CancelOrderUseCase implements UseCase
{
    public function __construct(
        private readonly OrderRepositoryContract $orderRepository
    ) {}

    public function __invoke(string $orderId, string $userId): Order
    {
        $order = $this->orderRepository->find($orderId);

        if (! $order || $order->userId !== $userId) {
            throw ValidationException::withMessages(['order' => 'Order not found']);
        }

        $cancelledStatusId = $this->orderRepository->getStatusIdByCode('cancelled') ?? 6;
        $order->statusId = $cancelledStatusId;
        $order->updatedAt = new \DateTimeImmutable;

        $this->orderRepository->save($order);

        return $order;
    }
}
