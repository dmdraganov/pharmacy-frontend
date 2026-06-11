<?php

namespace App\Modules\Cart\Infrastructure\Persistence\Eloquent;

use App\Modules\Cart\Domain\CartItem;
use App\Modules\Cart\Domain\CartItemRepositoryContract;

class CartItemRepository implements CartItemRepositoryContract
{
    public function find(int $id): ?CartItem
    {
        $cartItemModel = CartItemModel::find($id);
        if (! $cartItemModel) {
            return null;
        }

        return $this->toDomain($cartItemModel);
    }

    public function findByProduct(string $userId, string $productId): ?CartItem
    {
        $cartItemModel = CartItemModel::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
        if (! $cartItemModel) {
            return null;
        }

        return $this->toDomain($cartItemModel);
    }

    public function save(CartItem $cartItem): CartItem
    {
        $cartItemModel = CartItemModel::find($cartItem->id) ?? new CartItemModel;
        $cartItemModel->user_id = $cartItem->userId;
        $cartItemModel->product_id = $cartItem->productId;
        $cartItemModel->quantity = $cartItem->quantity;
        $cartItemModel->save();

        return $this->toDomain($cartItemModel);
    }

    public function delete(CartItem $cartItem): void
    {
        CartItemModel::destroy($cartItem->id);
    }

    public function list(string $userId): array
    {
        return CartItemModel::where('user_id', $userId)
            ->get()
            ->map(fn ($model) => $this->toDomain($model))
            ->all();
    }

    public function clear(string $userId): void
    {
        CartItemModel::where('user_id', $userId)->delete();
    }

    private function toDomain(CartItemModel $cartItemModel): CartItem
    {
        return new CartItem(
            id: $cartItemModel->id,
            userId: $cartItemModel->user_id,
            productId: $cartItemModel->product_id,
            quantity: $cartItemModel->quantity
        );
    }
}
