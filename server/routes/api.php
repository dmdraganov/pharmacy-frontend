<?php

use App\Modules\Users\Presentation\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

use App\Modules\Catalog\Presentation\Controllers\CatalogController;
use App\Modules\Users\Presentation\Controllers\ProfileController;

Route::get('/sections', [CatalogController::class, 'listSections']);
Route::get('/categories', [CatalogController::class, 'listCategories']);
Route::get('/brands', [CatalogController::class, 'listBrands']);
Route::get('/manufacturers', [CatalogController::class, 'listManufacturers']);
Route::get('/products', [CatalogController::class, 'listProducts']);
Route::get('/products/popular', [CatalogController::class, 'popularProducts']);
Route::get('/products/{id}', [CatalogController::class, 'showProduct']);

use App\Modules\Search\Presentation\Controllers\SearchController;

Route::get('/search/products', [SearchController::class, 'searchProducts']);

use App\Modules\Pharmacies\Presentation\Controllers\PharmacyController;

Route::get('/pharmacies', [PharmacyController::class, 'list']);
Route::get('/pharmacies/{id}/products', [PharmacyController::class, 'products']);
Route::get('/pharmacies/{id}', [PharmacyController::class, 'show']);

use App\Modules\Catalog\Presentation\Controllers\AdminCatalogController;
use App\Modules\Inventory\Presentation\Controllers\InventoryController;

Route::prefix('admin')->middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    Route::post('/products', [AdminCatalogController::class, 'createProduct']);
    Route::put('/products/{id}', [AdminCatalogController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminCatalogController::class, 'deleteProduct']);
    Route::post('/products/{id}/images', [AdminCatalogController::class, 'uploadImage']);
    Route::delete('/products/{id}/images/{imageId}', [AdminCatalogController::class, 'deleteImage']);
    Route::post('/sections', [AdminCatalogController::class, 'createSection']);
    Route::put('/sections/{id}', [AdminCatalogController::class, 'updateSection']);
    Route::delete('/sections/{id}', [AdminCatalogController::class, 'deleteSection']);
    Route::post('/categories', [AdminCatalogController::class, 'createCategory']);
    Route::put('/categories/{id}', [AdminCatalogController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminCatalogController::class, 'deleteCategory']);
    Route::post('/brands', [AdminCatalogController::class, 'createBrand']);
    Route::put('/brands/{id}', [AdminCatalogController::class, 'updateBrand']);
    Route::delete('/brands/{id}', [AdminCatalogController::class, 'deleteBrand']);
    Route::post('/manufacturers', [AdminCatalogController::class, 'createManufacturer']);
    Route::put('/manufacturers/{id}', [AdminCatalogController::class, 'updateManufacturer']);
    Route::delete('/manufacturers/{id}', [AdminCatalogController::class, 'deleteManufacturer']);
    Route::post('/pharmacies', [AdminCatalogController::class, 'createPharmacy']);
    Route::put('/pharmacies/{id}', [AdminCatalogController::class, 'updatePharmacy']);
    Route::delete('/pharmacies/{id}', [AdminCatalogController::class, 'deletePharmacy']);
});

use App\Modules\Orders\Presentation\Controllers\AdminOrderController;

Route::prefix('admin')->middleware(['auth:sanctum', 'role:ADMIN,MANAGER'])->group(function () {
    Route::get('/orders', [AdminOrderController::class, 'list']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    Route::get('/inventory', [InventoryController::class, 'list']);
    Route::get('/inventory/{pharmacyId}/{productId}', [InventoryController::class, 'show']);
    Route::patch('/inventory/{pharmacyId}/{productId}', [InventoryController::class, 'update']);
});

use App\Modules\Cart\Presentation\Controllers\CartController;
use App\Modules\Favorites\Presentation\Controllers\FavoritesController;
use App\Modules\Orders\Presentation\Controllers\OrderController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'create']);
    Route::get('/orders', [OrderController::class, 'list']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::get('/cart', [CartController::class, 'list']);
    Route::post('/cart', [CartController::class, 'add']);
    Route::patch('/cart/{cartItemId}', [CartController::class, 'update']);
    Route::delete('/cart/{cartItemId}', [CartController::class, 'remove']);
    Route::delete('/cart', [CartController::class, 'clear']);
    Route::get('/favorites', [FavoritesController::class, 'list']);
    Route::post('/favorites', [FavoritesController::class, 'add']);
    Route::delete('/favorites/{productId}', [FavoritesController::class, 'remove']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/users/profile', [ProfileController::class, 'show']);
    Route::patch('/users/profile', [ProfileController::class, 'update']);
});
