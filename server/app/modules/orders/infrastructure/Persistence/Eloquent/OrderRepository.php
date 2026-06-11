<?php

namespace App\Modules\Orders\Infrastructure\Persistence\Eloquent;

use App\Modules\Orders\Domain\Order;
use App\Modules\Orders\Domain\OrderCustomer;
use App\Modules\Orders\Domain\OrderItem;
use App\Modules\Orders\Domain\OrderRepositoryContract;
use Illuminate\Support\Facades\DB;

class OrderRepository implements OrderRepositoryContract
{
    public function find(string $id): ?Order
    {
        $orderModel = OrderModel::with(['items', 'user'])->find($id);
        if (! $orderModel) {
            return null;
        }

        return $this->toDomain($orderModel);
    }

    public function save(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $orderModel = OrderModel::find($order->id) ?? new OrderModel;
            $orderModel->id = $order->id;
            $orderModel->user_id = $order->userId;
            $orderModel->status_id = $order->statusId;
            $orderModel->delivery_method_id = $order->deliveryMethodId;
            $orderModel->payment_method_id = $order->paymentMethodId;
            $orderModel->pharmacy_id = $order->pharmacyId;
            $orderModel->delivery_country = $order->deliveryCountry;
            $orderModel->delivery_city = $order->deliveryCity;
            $orderModel->delivery_street = $order->deliveryStreet;
            $orderModel->delivery_house = $order->deliveryHouse;
            $orderModel->delivery_apartment = $order->deliveryApartment;
            $orderModel->delivery_postal_code = $order->deliveryPostalCode;
            $orderModel->total_amount = $order->totalPrice;
            $orderModel->save();

            $orderModel->items()->delete();
            $items = array_map(fn (OrderItem $item) => [
                'order_id' => $order->id,
                'product_id' => $item->productId,
                'quantity' => $item->quantity,
                'price_at_order' => $item->price,
            ], $order->items);
            $orderModel->items()->createMany($items);
        });
    }

    public function list(string $userId): array
    {
        return OrderModel::with('items')
            ->with('user')
            ->where('user_id', $userId)
            ->get()
            ->map(fn ($model) => $this->toDomain($model))
            ->all();
    }

    public function listAll(): array
    {
        return OrderModel::with(['items', 'user'])
            ->latest()
            ->get()
            ->map(fn ($model) => $this->toDomain($model))
            ->all();
    }

    public function getStatusIdByCode(string $code): ?int
    {
        return DB::table('order_statuses')->where('code', $code)->value('id')
            ?? DB::table('order_statuses')->where('name', $code)->value('id');
    }

    public function getStatusCodeById(int $id): ?string
    {
        return DB::table('order_statuses')->where('id', $id)->value('code');
    }

    public function getDeliveryMethodIdByCode(string $code): ?int
    {
        return DB::table('delivery_methods')->where('code', $code)->value('id');
    }

    public function getDeliveryMethodCodeById(int $id): ?string
    {
        return DB::table('delivery_methods')->where('id', $id)->value('code');
    }

    public function getPaymentMethodIdByCode(string $code): ?int
    {
        return DB::table('payment_methods')->where('code', $code)->value('id');
    }

    public function getPaymentMethodCodeById(int $id): ?string
    {
        return DB::table('payment_methods')->where('id', $id)->value('code');
    }

    private function toDomain(OrderModel $orderModel): Order
    {
        $items = $orderModel->items->map(fn ($itemModel) => new OrderItem(
            id: $itemModel->id,
            orderId: $itemModel->order_id,
            productId: $itemModel->product_id,
            quantity: $itemModel->quantity,
            price: $itemModel->price_at_order
        ))->all();
        $user = $orderModel->user;

        return new Order(
            id: $orderModel->id,
            userId: $orderModel->user_id,
            statusId: $orderModel->status_id,
            deliveryMethodId: $orderModel->delivery_method_id,
            paymentMethodId: $orderModel->payment_method_id,
            pharmacyId: $orderModel->pharmacy_id,
            deliveryCountry: $orderModel->delivery_country,
            deliveryCity: $orderModel->delivery_city,
            deliveryStreet: $orderModel->delivery_street,
            deliveryHouse: $orderModel->delivery_house,
            deliveryApartment: $orderModel->delivery_apartment,
            deliveryPostalCode: $orderModel->delivery_postal_code,
            totalPrice: $orderModel->total_amount,
            createdAt: \DateTimeImmutable::createFromInterface($orderModel->created_at),
            updatedAt: \DateTimeImmutable::createFromInterface($orderModel->updated_at),
            items: $items,
            customer: $user ? new OrderCustomer(
                id: $user->id,
                firstName: $user->first_name,
                lastName: $user->last_name,
                email: $user->email,
                phone: $user->phone,
            ) : null,
        );
    }
}
