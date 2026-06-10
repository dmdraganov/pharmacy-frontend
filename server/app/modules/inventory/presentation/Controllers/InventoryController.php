<?php

namespace App\Modules\Inventory\Presentation\Controllers;

use App\Modules\Inventory\Application\DTO\UpdateInventoryDTO;
use App\Modules\Inventory\Application\UseCases\GetInventoryUseCase;
use App\Modules\Inventory\Application\UseCases\ListInventoryUseCase;
use App\Modules\Inventory\Application\UseCases\UpdateInventoryUseCase;
use App\Modules\Inventory\Presentation\Resources\InventoryResource;
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class InventoryController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function list(Request $request, ListInventoryUseCase $useCase): JsonResponse
    {
        $request->validate([
            'pharmacy_id' => ['required', 'integer', 'exists:pharmacies,id'],
        ]);

        $pharmacyId = (int) $request->query('pharmacy_id');
        $inventory = $useCase($pharmacyId);
        $result = $this->paginateArray($inventory, $request);

        return $this->ok(InventoryResource::collection($result['data']), $result['meta']);
    }

    public function show(GetInventoryUseCase $useCase, int $pharmacyId, string $productId): JsonResponse
    {
        $inventory = $useCase($productId, $pharmacyId);
        if (! $inventory) {
            return response()->json(['message' => 'Inventory not found'], 404);
        }

        return $this->ok(new InventoryResource($inventory));
    }

    public function update(Request $request, UpdateInventoryUseCase $useCase, int $pharmacyId, string $productId): JsonResponse
    {
        $dto = new UpdateInventoryDTO(
            productId: $productId,
            pharmacyId: $pharmacyId,
            stockQuantity: $request->input('stock_quantity')
        );

        $inventory = $useCase($dto);

        return $this->ok(new InventoryResource($inventory));
    }
}
