<?php

namespace App\Modules\Cart\Presentation\Controllers;

use App\Modules\Cart\Application\UseCases\AddToCartUseCase;
use App\Modules\Cart\Application\UseCases\ClearCartUseCase;
use App\Modules\Cart\Application\UseCases\ListCartItemsUseCase;
use App\Modules\Cart\Application\UseCases\RemoveFromCartUseCase;
use App\Modules\Cart\Application\UseCases\UpdateCartItemUseCase;
use App\Modules\Cart\Presentation\Resources\CartItemResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CartController extends Controller
{
    public function list(Request $request, ListCartItemsUseCase $useCase): JsonResponse
    {
        $cartItems = $useCase($request->user()->id);

        return response()->json(CartItemResource::collection($cartItems));
    }

    public function add(Request $request, AddToCartUseCase $useCase): JsonResponse
    {
        $useCase($request->user()->id, $request->input('product_id'), $request->input('quantity', 1));

        return response()->json(null, 204);
    }

    public function update(Request $request, UpdateCartItemUseCase $useCase, int $cartItemId): JsonResponse
    {
        $useCase($cartItemId, $request->input('quantity'));

        return response()->json(null, 204);
    }

    public function remove(RemoveFromCartUseCase $useCase, int $cartItemId): JsonResponse
    {
        $useCase($cartItemId);

        return response()->json(null, 204);
    }

    public function clear(Request $request, ClearCartUseCase $useCase): JsonResponse
    {
        $useCase($request->user()->id);

        return response()->json(null, 204);
    }
}
