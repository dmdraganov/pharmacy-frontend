<?php

namespace App\Modules\Users\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class RoleModel extends Model
{
    protected $table = 'roles';

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];
}
