<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Modules\Inventory\Application\DTO\UpdateInventoryDTO;
use App\Modules\Inventory\Application\UseCases\GetInventoryUseCase;
use App\Modules\Inventory\Application\UseCases\ListInventoryUseCase;
use App\Modules\Inventory\Application\UseCases\UpdateInventoryUseCase;
use App\Modules\Inventory\Presentation\Resources\InventoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class InventoryController extends Controller
{
    public function list(Request $request, ListInventoryUseCase $useCase): JsonResponse
    {
        // For simplicity, getting pharmacyId from request. In real app, it might be from user's permissions.
        $pharmacyId = $request->query('pharmacy_id');
        $inventory = $useCase($pharmacyId);

        return response()->json(InventoryResource::collection($inventory));
    }

    public function show(GetInventoryUseCase $useCase, int $pharmacyId, string $productId): JsonResponse
    {
        $inventory = $useCase($productId, $pharmacyId);
        if (! $inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }

        return response()->json(new InventoryResource($inventory));
    }

    public function update(Request $request, UpdateInventoryUseCase $useCase, int $pharmacyId, string $productId): JsonResponse
    {
        $dto = new UpdateInventoryDTO(
            productId: $productId,
            pharmacyId: $pharmacyId,
            stockQuantity: $request->input('stock_quantity')
        );

        $inventory = $useCase($dto);

        return response()->json(new InventoryResource($inventory));
    }
}
