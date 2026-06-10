<?php

namespace App\Modules\Catalog\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProductModel extends Model
{
    use HasUuids;

    protected $table = 'products';

    public $timestamps = true;

    protected $fillable = [
        'category_id',
        'brand_id',
        'manufacturer_id',
        'slug',
        'name',
        'price',
        'old_price',
        'description',
        'is_popular',
        'is_prescription',
        'info',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'info' => 'array',
        'is_popular' => 'boolean',
        'is_prescription' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(CategoryModel::class);
    }

    public function brand()
    {
        return $this->belongsTo(BrandModel::class);
    }

    public function manufacturer()
    {
        return $this->belongsTo(ManufacturerModel::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImageModel::class);
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttributeModel::class);
    }
}
