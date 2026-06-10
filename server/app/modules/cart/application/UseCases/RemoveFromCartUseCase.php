<?php

namespace App\Modules\Cart\Application\UseCases;

use App\Modules\Cart\Domain\CartItemRepositoryContract;
use App\Shared\Application\UseCase;

class RemoveFromCartUseCase implements UseCase
{
    public function __construct(
        private readonly CartItemRepositoryContract $cartItemRepository
    ) {}

    public function __invoke(int $cartItemId): void
    {
        $cartItem = $this->cartItemRepository->find($cartItemId);
        $this->cartItemRepository->delete($cartItem);
    }
}
