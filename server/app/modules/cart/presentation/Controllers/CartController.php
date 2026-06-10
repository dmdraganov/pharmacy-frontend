<?php

namespace App\Modules\Cart\Presentation\Controllers;

use App\Modules\Cart\Application\UseCases\AddToCartUseCase;
use App\Modules\Cart\Application\UseCases\ClearCartUseCase;
use App\Modules\Cart\Application\UseCases\ListCartItemsUseCase;
use App\Modules\Cart\Application\UseCases\RemoveFromCartUseCase;
use App\Modules\Cart\Application\UseCases\UpdateCartItemUseCase;
use App\Modules\Cart\Presentation\Resources\CartItemResource;
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CartController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function list(Request $request, ListCartItemsUseCase $useCase): JsonResponse
    {
        $cartItems = $useCase($request->user()->id);
        $result = $this->paginateArray($cartItems, $request);

        return $this->ok(CartItemResource::collection($result['data']), $result['meta']);
    }

    public function add(Request $request, AddToCartUseCase $useCase): JsonResponse
    {
        $useCase($request->user()->id, $request->input('product_id'), $request->input('quantity', 1));

        return $this->noContent();
    }

    public function update(Request $request, UpdateCartItemUseCase $useCase, int $cartItemId): JsonResponse
    {
        $useCase($cartItemId, $request->input('quantity'));

        return $this->noContent();
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
