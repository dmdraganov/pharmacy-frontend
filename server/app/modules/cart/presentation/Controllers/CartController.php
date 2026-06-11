<?php

namespace App\Modules\Cart\Presentation\Controllers;

use App\Modules\Cart\Application\UseCases\AddToCartUseCase;
use App\Modules\Cart\Application\UseCases\ClearCartUseCase;
use App\Modules\Cart\Application\UseCases\ListCartItemsUseCase;
use App\Modules\Cart\Application\UseCases\RemoveFromCartUseCase;
use App\Modules\Cart\Application\UseCases\UpdateCartItemUseCase;
use App\Modules\Cart\Presentation\Resources\CartItemResource;
use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Modules\Catalog\Presentation\Resources\ProductResource;
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CartController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function list(
        Request $request,
        ListCartItemsUseCase $useCase,
        ProductRepositoryContract $productRepository
    ): JsonResponse
    {
        $cartItems = $useCase($request->user()->id);
        $itemsWithProducts = array_map(
            function ($item) use ($request, $productRepository): array {
                $payload = (new CartItemResource($item))->resolve($request);
                $product = $productRepository->find($item->productId);

                return [
                    ...$payload,
                    'product' => $product
                        ? (new ProductResource($product))->resolve($request)
                        : null,
                ];
            },
            $cartItems
        );
        $result = $this->paginateArray($itemsWithProducts, $request);

        return $this->ok($result['data'], $result['meta']);
    }

    public function add(Request $request, AddToCartUseCase $useCase): JsonResponse
    {
        $cartItem = $useCase($request->user()->id, $request->input('product_id'), $request->input('quantity', 1));

        return $this->ok(new CartItemResource($cartItem));
    }

    public function update(Request $request, UpdateCartItemUseCase $useCase, int $cartItemId): JsonResponse
    {
        $cartItem = $useCase($cartItemId, $request->input('quantity'));

        return $this->ok(new CartItemResource($cartItem));
    }

    public function remove(RemoveFromCartUseCase $useCase, int $cartItemId): JsonResponse
    {
        $useCase($cartItemId);

        return $this->noContent();
    }

    public function clear(Request $request, ClearCartUseCase $useCase): JsonResponse
    {
        $useCase($request->user()->id);

        return $this->noContent();
    }
}
