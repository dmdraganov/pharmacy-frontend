<?php

namespace App\Modules\Orders\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class OrderItemModel extends Model
{
    protected $table = 'order_items';

    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price_at_order',
    ];
}
