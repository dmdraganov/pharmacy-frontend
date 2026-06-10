<?php

namespace App\Modules\Orders\Presentation\Controllers;

use App\Modules\Orders\Application\DTO\UpdateOrderStatusDTO;
use App\Modules\Orders\Application\UseCases\GetOrderUseCase;
use App\Modules\Orders\Application\UseCases\ListAllOrdersUseCase;
use App\Modules\Orders\Application\UseCases\UpdateOrderStatusUseCase;
use App\Modules\Orders\Presentation\Requests\UpdateOrderStatusRequest;
use App\Modules\Orders\Presentation\Resources\OrderResource;
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminOrderController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function list(Request $request, ListAllOrdersUseCase $useCase): JsonResponse
    {
        $orders = $useCase();
        $result = $this->paginateArray($orders, $request);

        return $this->ok(OrderResource::collection($result['data']), $result['meta']);
    }

    public function show(GetOrderUseCase $useCase, string $id): JsonResponse
    {
        $order = $useCase($id);
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return $this->ok(new OrderResource($order));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, UpdateOrderStatusUseCase $useCase, string $id): JsonResponse
    {
        $dto = new UpdateOrderStatusDTO(
            orderId: $id,
            statusId: $request->input('status_id')
        );

        $order = $useCase($dto);

        return $this->ok(new OrderResource($order));
    }
}
