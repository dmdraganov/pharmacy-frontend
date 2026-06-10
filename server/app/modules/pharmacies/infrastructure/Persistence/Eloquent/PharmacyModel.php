<?php

namespace App\Modules\Pharmacies\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class PharmacyModel extends Model
{
    protected $table = 'pharmacies';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'address',
        'working_hours',
    ];
}
