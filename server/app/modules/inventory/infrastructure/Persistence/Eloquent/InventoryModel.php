<?php

namespace App\Modules\Inventory\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class InventoryModel extends Model
{
    protected $table = 'inventory';

    public $timestamps = true;

    public const CREATED_AT = null;

    public const UPDATED_AT = 'updated_at';

    protected $primaryKey = ['product_id', 'pharmacy_id'];

    public $incrementing = false;

    protected $fillable = [
        'product_id',
        'pharmacy_id',
        'stock_quantity',
        'reserved_quantity',
    ];
}
