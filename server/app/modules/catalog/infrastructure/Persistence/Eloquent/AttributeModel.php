<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class AttributeModel extends Model
{
    protected $table = 'attributes';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];
}
