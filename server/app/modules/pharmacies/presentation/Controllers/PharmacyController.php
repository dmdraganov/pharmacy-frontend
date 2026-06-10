<?php

namespace App\Modules\Pharmacies\Presentation\Controllers;

use App\Modules\Catalog\Presentation\Resources\ProductResource;
use App\Modules\Pharmacies\Application\UseCases\GetPharmacyUseCase;
use App\Modules\Pharmacies\Application\UseCases\ListPharmaciesUseCase;
use App\Modules\Pharmacies\Application\UseCases\ListPharmacyProductsUseCase;
use App\Modules\Pharmacies\Presentation\Resources\PharmacyResource;
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PharmacyController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function list(Request $request, ListPharmaciesUseCase $useCase): JsonResponse
    {
        $pharmacies = $useCase();
        $result = $this->paginateArray($pharmacies, $request);

        return $this->ok(PharmacyResource::collection($result['data']), $result['meta']);
    }

    public function show(GetPharmacyUseCase $useCase, int $id): JsonResponse
    {
        $pharmacy = $useCase($id);
        if (! $pharmacy) {
            return response()->json(['message' => 'Pharmacy not found'], 404);
        }

        return $this->ok(new PharmacyResource($pharmacy));
    }

    public function products(Request $request, ListPharmacyProductsUseCase $useCase, int $id): JsonResponse
    {
        $result = $useCase($id, $request->all());

        return $this->ok(ProductResource::collection($result['data']), $result['meta']);
    }
}
