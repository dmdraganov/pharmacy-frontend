<?php

namespace App\Modules\Favorites\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class FavoriteModel extends Model
{
    protected $table = 'user_favorites';

    public $timestamps = true;

    protected $primaryKey = ['user_id', 'product_id'];

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'product_id',
    ];
}
