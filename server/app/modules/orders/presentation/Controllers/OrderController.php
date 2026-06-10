<?php

namespace App\Modules\Orders\Presentation\Controllers;

use App\Modules\Orders\Application\DTO\CreateOrderDTO;
use App\Modules\Orders\Application\UseCases\CancelOrderUseCase;
use App\Modules\Orders\Application\UseCases\CreateOrderUseCase;
use App\Modules\Orders\Application\UseCases\GetOrderUseCase;
use App\Modules\Orders\Application\UseCases\ListOrdersUseCase;
use App\Modules\Orders\Presentation\Requests\CreateOrderRequest;
use App\Modules\Orders\Presentation\Resources\OrderResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class OrderController extends Controller
{
    public function create(CreateOrderRequest $request, CreateOrderUseCase $useCase): JsonResponse
    {
        $dto = new CreateOrderDTO(
            userId: $request->user()->id,
            deliveryMethodId: $request->input('delivery_method_id'),
            paymentMethodId: $request->input('payment_method_id'),
            pharmacyId: $request->input('pharmacy_id'),
            deliveryCountry: $request->input('delivery_country'),
            deliveryCity: $request->input('delivery_city'),
            deliveryStreet: $request->input('delivery_street'),
            deliveryHouse: $request->input('delivery_house'),
            deliveryApartment: $request->input('delivery_apartment'),
            deliveryPostalCode: $request->input('delivery_postal_code'),
            items: $request->input('items')
        );

        $order = $useCase($dto);

        return response()->json(new OrderResource($order), 201);
    }

    public function list(Request $request, ListOrdersUseCase $useCase): JsonResponse
    {
        $orders = $useCase($request->user()->id);

        return response()->json(OrderResource::collection($orders));
    }

    public function show(GetOrderUseCase $useCase, string $id): JsonResponse
    {
        $order = $useCase($id);
        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json(new OrderResource($order));
    }

    public function cancel(Request $request, CancelOrderUseCase $useCase, string $id): JsonResponse
    {
        $order = $useCase($id, $request->user()->id);

        return response()->json(new OrderResource($order));
    }
}
