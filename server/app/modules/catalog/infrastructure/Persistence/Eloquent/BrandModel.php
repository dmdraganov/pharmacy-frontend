<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class BrandModel extends Model
{
    protected $table = 'brands';

    public $timestamps = true;

    protected $fillable = [
        'name',
    ];
}
