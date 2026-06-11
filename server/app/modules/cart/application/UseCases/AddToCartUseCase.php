<?php

namespace App\Modules\Cart\Application\UseCases;

use App\Modules\Cart\Domain\CartItem;
use App\Modules\Cart\Domain\CartItemRepositoryContract;
use App\Shared\Application\UseCase;

class AddToCartUseCase implements UseCase
{
    public function __construct(
        private readonly CartItemRepositoryContract $cartItemRepository
    ) {}

    public function __invoke(string $userId, string $productId, int $quantity): CartItem
    {
        $cartItem = $this->cartItemRepository->findByProduct($userId, $productId);

        if ($cartItem) {
            $cartItem->quantity += $quantity;
        } else {
            $cartItem = new CartItem(0, $userId, $productId, $quantity);
        }

        return $this->cartItemRepository->save($cartItem);
    }
}
