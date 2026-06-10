<?php

namespace App\Modules\Cart\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class CartItemModel extends Model
{
    protected $table = 'cart_items';

    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];
}
