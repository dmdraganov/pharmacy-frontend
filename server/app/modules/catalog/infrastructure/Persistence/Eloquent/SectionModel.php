<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class SectionModel extends Model
{
    protected $table = 'sections';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
    ];

    public function categories()
    {
        return $this->hasMany(CategoryModel::class);
    }
}
