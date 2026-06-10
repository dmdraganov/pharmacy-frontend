<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class CategoryModel extends Model
{
    protected $table = 'categories';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
        'section_id',
    ];

    public function section()
    {
        return $this->belongsTo(SectionModel::class);
    }
}
