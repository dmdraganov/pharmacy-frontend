<?php

namespace Tests\Feature;

use App\Modules\Users\Infrastructure\Persistence\Eloquent\UserModel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_order_list_includes_customer(): void
    {
        $admin = UserModel::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $customer = UserModel::create([
            'first_name' => 'Ирина',
            'last_name' => 'Покупатель',
            'email' => 'customer@example.com',
            'phone' => '+7 900 300-30-30',
            'password' => Hash::make('password'),
        ]);

        $adminRoleId = DB::table('roles')->where('name', 'ADMIN')->value('id');
        DB::table('user_roles')->insert([
            'user_id' => $admin->id,
            'role_id' => $adminRoleId,
        ]);

        Sanctum::actingAs($admin);

        $pharmacyId = DB::table('pharmacies')->insertGetId([
            'name' => 'Test pharmacy',
            'address' => 'Test address',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $orderId = '30000000-0000-4000-8000-000000000001';
        DB::table('orders')->insert([
            'id' => $orderId,
            'user_id' => $customer->id,
            'status_id' => DB::table('order_statuses')->where('code', 'new')->value('id'),
            'delivery_method_id' => DB::table('delivery_methods')->where('code', 'pickup')->value('id'),
            'payment_method_id' => DB::table('payment_methods')->where('code', 'online')->value('id'),
            'pharmacy_id' => $pharmacyId,
            'total_amount' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->getJson('/api/admin/orders');

        $response->assertOk()
            ->assertJsonPath('data.0.id', $orderId)
            ->assertJsonPath('data.0.user.id', $customer->id)
            ->assertJsonPath('data.0.user.first_name', 'Ирина')
            ->assertJsonPath('data.0.user.last_name', 'Покупатель')
            ->assertJsonPath('data.0.user.email', 'customer@example.com')
            ->assertJsonPath('data.0.user.phone', '+7 900 300-30-30');
    }
}
