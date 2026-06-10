<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class ManufacturerModel extends Model
{
    protected $table = 'manufacturers';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'country',
    ];
}
