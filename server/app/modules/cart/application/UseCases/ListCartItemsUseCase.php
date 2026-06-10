<?php

namespace App\Modules\Cart\Application\UseCases;

use App\Modules\Cart\Domain\CartItemRepositoryContract;
use App\Shared\Application\UseCase;

class ListCartItemsUseCase implements UseCase
{
    public function __construct(
        private readonly CartItemRepositoryContract $cartItemRepository
    ) {}

    public function __invoke(string $userId): array
    {
        return $this->cartItemRepository->list($userId);
    }
}
