<?php

namespace App\Modules\Favorites\Presentation\Controllers;

use App\Modules\Favorites\Application\UseCases\AddToFavoritesUseCase;
use App\Modules\Favorites\Application\UseCases\ListFavoritesUseCase;
use App\Modules\Favorites\Application\UseCases\RemoveFromFavoritesUseCase;
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class FavoritesController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function list(Request $request, ListFavoritesUseCase $useCase): JsonResponse
    {
        $favorites = $useCase($request->user()->id);
        $result = $this->paginateArray($favorites, $request);

        return $this->ok($result['data'], $result['meta']);
    }

    public function add(Request $request, AddToFavoritesUseCase $useCase): JsonResponse
    {
        $request->validate([
            'product_id' => ['required', 'string', 'exists:products,id'],
        ]);

        $productId = $request->input('product_id');
        $useCase($request->user()->id, $productId);

        return $this->noContent();
    }

    public function remove(Request $request, RemoveFromFavoritesUseCase $useCase, string $productId): JsonResponse
    {
        $useCase($request->user()->id, $productId);

        return $this->noContent();
    }
}
