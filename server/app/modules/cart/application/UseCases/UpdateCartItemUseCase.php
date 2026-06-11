<?php

namespace App\Modules\Cart\Application\UseCases;

use App\Modules\Cart\Domain\CartItemRepositoryContract;
use App\Shared\Application\UseCase;

class UpdateCartItemUseCase implements UseCase
{
    public function __construct(
        private readonly CartItemRepositoryContract $cartItemRepository
    ) {}

    public function __invoke(int $cartItemId, int $quantity): \App\Modules\Cart\Domain\CartItem
    {
        $cartItem = $this->cartItemRepository->find($cartItemId);
        $cartItem->quantity = $quantity;
        return $this->cartItemRepository->save($cartItem);
    }
}
