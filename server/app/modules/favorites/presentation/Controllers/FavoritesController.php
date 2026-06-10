<?php

namespace App\Modules\Favorites\Presentation\Controllers;

use App\Modules\Favorites\Application\UseCases\AddToFavoritesUseCase;
use App\Modules\Favorites\Application\UseCases\ListFavoritesUseCase;
use App\Modules\Favorites\Application\UseCases\RemoveFromFavoritesUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class FavoritesController extends Controller
{
    public function list(Request $request, ListFavoritesUseCase $useCase): JsonResponse
    {
        $favorites = $useCase($request->user()->id);

        return response()->json($favorites);
    }

    public function add(Request $request, AddToFavoritesUseCase $useCase): JsonResponse
    {
        $request->validate([
            'product_id' => ['required', 'string', 'exists:products,id'],
        ]);

        $productId = $request->input('product_id');
        $useCase($request->user()->id, $productId);

        return response()->json(null, 204);
    }

    public function remove(Request $request, RemoveFromFavoritesUseCase $useCase, string $productId): JsonResponse
    {
        $useCase($request->user()->id, $productId);

        return response()->json(null, 204);
    }
}
