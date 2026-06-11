<?php

namespace App\Modules\Orders\Infrastructure\Persistence\Eloquent;

use App\Modules\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OrderModel extends Model
{
    use HasUuids;

    protected $table = 'orders';

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'status_id',
        'delivery_method_id',
        'payment_method_id',
        'pharmacy_id',
        'delivery_country',
        'delivery_city',
        'delivery_street',
        'delivery_house',
        'delivery_apartment',
        'delivery_postal_code',
        'total_amount',
    ];

    public function items()
    {
        return $this->hasMany(OrderItemModel::class, 'order_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }
}
