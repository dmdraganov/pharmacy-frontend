<?php

namespace Tests\Feature;

use App\Modules\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_product_catalog_relations(): void
    {
        $admin = UserModel::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        $adminRoleId = DB::table('roles')->where('name', 'ADMIN')->value('id');
        DB::table('user_roles')->insert([
            'user_id' => $admin->id,
            'role_id' => $adminRoleId,
        ]);

        Sanctum::actingAs($admin);

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

        $nextCategoryId = DB::table('categories')->insertGetId([
            'name' => 'Cold care',
            'section_id' => $sectionId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $nextBrandId = DB::table('brands')->insertGetId([
            'name' => 'Brand B',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $nextManufacturerId = DB::table('manufacturers')->insertGetId([
            'name' => 'Manufacturer B',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $productId = '20000000-0000-4000-8000-000000000999';
        DB::table('products')->insert([
            'id' => $productId,
            'name' => 'Original product',
            'slug' => 'original-product',
            'description' => 'Original description',
            'price' => 100,
            'old_price' => null,
            'is_popular' => false,
            'is_prescription' => false,
            'category_id' => $categoryId,
            'brand_id' => $brandId,
            'manufacturer_id' => $manufacturerId,
            'created_by' => $admin->id,
            'updated_by' => $admin->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->putJson("/api/admin/products/{$productId}", [
            'name' => 'Updated product',
            'slug' => 'updated-product',
            'description' => 'Updated description',
            'price' => 125.50,
            'old_price' => 150,
            'is_popular' => true,
            'is_prescription' => true,
            'category_id' => $nextCategoryId,
            'brand_id' => $nextBrandId,
            'manufacturer_id' => $nextManufacturerId,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.id', $productId)
            ->assertJsonPath('data.name', 'Updated product')
            ->assertJsonPath('data.category_id', $nextCategoryId)
            ->assertJsonPath('data.brand_id', $nextBrandId)
            ->assertJsonPath('data.manufacturer_id', $nextManufacturerId);

        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'slug' => 'updated-product',
            'category_id' => $nextCategoryId,
            'brand_id' => $nextBrandId,
            'manufacturer_id' => $nextManufacturerId,
        ]);
    }
}
