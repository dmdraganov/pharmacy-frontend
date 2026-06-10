<?php

namespace App\Modules\Pharmacies\Presentation\Controllers;

use App\Modules\Pharmacies\Application\UseCases\GetPharmacyUseCase;
use App\Modules\Pharmacies\Application\UseCases\ListPharmaciesUseCase;
use App\Modules\Pharmacies\Presentation\Resources\PharmacyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class PharmacyController extends Controller
{
    public function list(ListPharmaciesUseCase $useCase): JsonResponse
    {
        $pharmacies = $useCase();

        return response()->json(PharmacyResource::collection($pharmacies));
    }

    public function show(GetPharmacyUseCase $useCase, int $id): JsonResponse
    {
        $pharmacy = $useCase($id);
        if (! $pharmacy) {
            return response()->json(['message' => 'Pharmacy not found'], 404);
        }

        return response()->json(new PharmacyResource($pharmacy));
    }
}
