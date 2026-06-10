<?php

namespace App\Modules\Orders\Application\UseCases;

use App\Modules\Orders\Domain\Order;
use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Shared\Application\UseCase;

class GetOrderUseCase implements UseCase
{
    public function __construct(
        private readonly OrderRepositoryContract $orderRepository
    ) {}

    public function __invoke(string $id): ?Order
    {
        return $this->orderRepository->find($id);
    }
}
