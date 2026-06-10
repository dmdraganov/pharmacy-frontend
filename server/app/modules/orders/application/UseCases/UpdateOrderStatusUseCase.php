<?php

namespace App\Modules\Orders\Application\UseCases;

use App\Modules\Orders\Application\DTO\UpdateOrderStatusDTO;
use App\Modules\Orders\Domain\Order;
use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Validation\ValidationException;

class UpdateOrderStatusUseCase implements UseCase
{
    public function __construct(
        private readonly OrderRepositoryContract $orderRepository
    ) {}

    public function __invoke(UpdateOrderStatusDTO $data): Order
    {
        $order = $this->orderRepository->find($data->orderId);
        if (! $order) {
            throw ValidationException::withMessages(['order' => 'Order not found']);
        }

        $currentStatus = $this->orderRepository->getStatusCodeById($order->statusId);
        $nextStatus = $this->orderRepository->getStatusCodeById($data->statusId);

        if (! $currentStatus) {
            throw ValidationException::withMessages(['status_id' => 'Current order status is invalid']);
        }

        if (! $nextStatus) {
            throw ValidationException::withMessages(['status_id' => 'Invalid order status']);
        }

        $allowedTransitions = [
            'new' => ['processing', 'cancelled'],
            'processing' => ['shipping', 'cancelled'],
            'shipping' => ['delivered'],
            'delivered' => ['completed'],
            'completed' => [],
            'cancelled' => [],
        ];

        if (! in_array($nextStatus, $allowedTransitions[$currentStatus] ?? [], true)) {
            throw ValidationException::withMessages([
                'status_id' => "Cannot change order status from {$currentStatus} to {$nextStatus}",
            ]);
        }

        $order->statusId = $data->statusId;
        $order->updatedAt = new \DateTimeImmutable;

        $this->orderRepository->save($order);

        return $order;
    }
}
