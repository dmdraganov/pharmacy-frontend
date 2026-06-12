<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProductCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_response_includes_main_image_and_images(): void
    {
        $sectionId = DB::table('sections')->insertGetId([
            'name' => 'Medicines',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $categoryId = DB::table('categories')->insertGetId([
            'name' => 'Pain relief',
            'section_id' => $sectionId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $brandId = DB::table('brands')->insertGetId([
            'name' => 'Brand A',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $manufacturerId = DB::table('manufacturers')->insertGetId([
            'name' => 'Manufacturer A',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $productId = '20000000-0000-4000-8000-000000000123';
        DB::table('products')->insert([
            'id' => $productId,
            'name' => 'Catalog product',
            'slug' => 'catalog-product',
            'description' => 'Catalog description',
            'price' => 100,
            'old_price' => null,
            'is_popular' => false,
            'is_prescription' => false,
            'category_id' => $categoryId,
            'brand_id' => $brandId,
            'manufacturer_id' => $manufacturerId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('product_images')->insert([
            [
                'id' => '30000000-0000-4000-8000-000000000123',
                'product_id' => $productId,
                'image_url' => '/assets/images/products/catalog-main.webp',
                'alt_text' => 'Main product image',
                'sort_order' => 10,
                'is_main' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '30000000-0000-4000-8000-000000000124',
                'product_id' => $productId,
                'image_url' => '/assets/images/products/catalog-secondary.webp',
                'alt_text' => 'Secondary product image',
                'sort_order' => 0,
                'is_main' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $response = $this->getJson("/api/products/{$productId}");

        $response->assertOk()
            ->assertJsonPath('data.id', $productId)
            ->assertJsonPath('data.image', '/assets/images/products/catalog-main.webp')
            ->assertJsonPath('data.images.0.image_url', '/assets/images/products/catalog-main.webp')
            ->assertJsonPath('data.images.1.image_url', '/assets/images/products/catalog-secondary.webp');
    }
}
