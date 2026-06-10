<?php

namespace App\Modules\Orders\Application\UseCases;

use App\Modules\Catalog\Domain\ProductRepositoryContract;
use App\Modules\Inventory\Domain\InventoryRepositoryContract;
use App\Modules\Orders\Application\DTO\CreateOrderDTO;
use App\Modules\Orders\Domain\Order;
use App\Modules\Orders\Domain\OrderItem;
use App\Modules\Orders\Domain\OrderRepositoryContract;
use App\Shared\Application\UseCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateOrderUseCase implements UseCase
{
    public function __construct(
        private readonly OrderRepositoryContract $orderRepository,
        private readonly ProductRepositoryContract $productRepository,
        private readonly InventoryRepositoryContract $inventoryRepository
    ) {}

    public function __invoke(CreateOrderDTO $data): Order
    {
        return DB::transaction(function () use ($data): Order {
            $totalPrice = 0;
            $orderItems = [];
            $isPickup = $data->deliveryMethodId === 1;

            if ($isPickup && ! $data->pharmacyId) {
                throw ValidationException::withMessages(['pharmacy_id' => 'Pharmacy is required for pickup orders']);
            }

            if (! $isPickup && (! $data->deliveryCity || ! $data->deliveryStreet)) {
                throw ValidationException::withMessages(['delivery_address' => 'Delivery city and street are required']);
            }

            foreach ($data->items as $item) {
                $product = $this->productRepository->find($item['product_id']);
                if (! $product) {
                    throw ValidationException::withMessages(['items' => 'Product not found']);
                }
                if ($product->isPrescription && ! $isPickup) {
                    throw ValidationException::withMessages(['items' => 'Prescription products can only be picked up']);
                }

                $pharmacyId = $data->pharmacyId ?? 1;
                $inventory = $this->inventoryRepository->find($product->id, $pharmacyId);
                $availableQuantity = $inventory ? $inventory->stockQuantity - $inventory->reservedQuantity : 0;

                if ($availableQuantity < $item['quantity']) {
                    throw ValidationException::withMessages(['items' => 'Not enough stock for product '.$product->name]);
                }

                $totalPrice += $product->price * $item['quantity'];
                $orderItems[] = new OrderItem(0, '', $product->id, $item['quantity'], $product->price);

                $inventory->reservedQuantity += $item['quantity'];
                $this->inventoryRepository->save($inventory);
            }

            $order = new Order(
                id: Str::uuid()->toString(),
                userId: $data->userId,
                statusId: 1, // Assuming 1 is "new"
                deliveryMethodId: $data->deliveryMethodId,
                paymentMethodId: $data->paymentMethodId,
                pharmacyId: $data->pharmacyId,
                deliveryCountry: $data->deliveryCountry,
                deliveryCity: $data->deliveryCity,
                deliveryStreet: $data->deliveryStreet,
                deliveryHouse: $data->deliveryHouse,
                deliveryApartment: $data->deliveryApartment,
                deliveryPostalCode: $data->deliveryPostalCode,
                totalPrice: $totalPrice,
                createdAt: new \DateTimeImmutable,
                updatedAt: new \DateTimeImmutable,
                items: $orderItems
            );

            $this->orderRepository->save($order);

            return $order;
        });
    }
}
