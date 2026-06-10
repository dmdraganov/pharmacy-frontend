<?php

namespace App\Modules\Search\Presentation\Controllers;

use App\Modules\Catalog\Presentation\Resources\ProductResource;
use App\Modules\Search\Application\UseCases\SearchProductsUseCase;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SearchController extends Controller
{
    use ApiResponse;

    public function searchProducts(Request $request, SearchProductsUseCase $useCase): JsonResponse
    {
        $results = $useCase($request->only([
            'query',
            'category_id',
            'brand_id',
            'manufacturer_id',
            'min_price',
            'max_price',
            'is_prescription',
            'sort',
        ]));

        return $this->ok(ProductResource::collection($results['data']), $results['meta']);
    }
}
