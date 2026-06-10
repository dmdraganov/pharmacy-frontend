<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class ProductAttributeModel extends Model
{
    protected $table = 'product_attributes';

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'attribute_id',
        'value',
    ];
}
