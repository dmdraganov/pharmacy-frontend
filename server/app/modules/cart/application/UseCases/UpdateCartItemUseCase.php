<?php

namespace App\Modules\Cart\Application\UseCases;

use App\Modules\Cart\Domain\CartItemRepositoryContract;
use App\Shared\Application\UseCase;

class UpdateCartItemUseCase implements UseCase
{
    public function __construct(
        private readonly CartItemRepositoryContract $cartItemRepository
    ) {}

    public function __invoke(int $cartItemId, int $quantity): void
    {
        $cartItem = $this->cartItemRepository->find($cartItemId);
        $cartItem->quantity = $quantity;
        $this->cartItemRepository->save($cartItem);
    }
}
