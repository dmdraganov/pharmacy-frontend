<?php

namespace App\Modules\Search\Presentation\Controllers;

use App\Modules\Search\Application\UseCases\SearchProductsUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SearchController extends Controller
{
    public function searchProducts(Request $request, SearchProductsUseCase $useCase): JsonResponse
    {
        $results = $useCase($request->input('query'));

        return response()->json($results);
    }
}
