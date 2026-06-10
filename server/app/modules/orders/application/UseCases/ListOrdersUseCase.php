<?php

namespace App\Modules\Orders\Application\UseCases;

use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Shared\Application\UseCase;

class ListOrdersUseCase implements UseCase
{
    public function __construct(
        private readonly OrderRepositoryContract $orderRepository
    ) {}

    public function __invoke(string $userId): array
    {
        return $this->orderRepository->list($userId);
    }
}
