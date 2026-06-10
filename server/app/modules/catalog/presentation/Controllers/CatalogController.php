<?php

namespace App\Modules\Catalog\Presentation\Controllers;

use App\Modules\Catalog\Application\UseCases\GetProductUseCase;
use App\Modules\Catalog\Application\UseCases\ListBrandsUseCase;
use App\Modules\Catalog\Application\UseCases\ListCategoriesUseCase;
use App\Modules\Catalog\Application\UseCases\ListManufacturersUseCase;
use App\Modules\Catalog\Application\UseCases\ListProductsUseCase;
use App\Modules\Catalog\Application\UseCases\ListSectionsUseCase;
use App\Modules\Catalog\Presentation\Resources\BrandResource;
use App\Modules\Catalog\Presentation\Resources\CategoryResource;
use App\Modules\Catalog\Presentation\Resources\ManufacturerResource;
use App\Modules\Catalog\Presentation\Resources\ProductResource;
use App\Modules\Catalog\Presentation\Resources\SectionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CatalogController extends Controller
{
    public function __construct() {}

    public function listSections(ListSectionsUseCase $useCase): JsonResponse
    {
        $sections = $useCase();

        return response()->json(SectionResource::collection($sections));
    }

    public function listCategories(ListCategoriesUseCase $useCase): JsonResponse
    {
        $categories = $useCase();

        return response()->json(CategoryResource::collection($categories));
    }

    public function listBrands(ListBrandsUseCase $useCase): JsonResponse
    {
        $brands = $useCase();

        return response()->json(BrandResource::collection($brands));
    }

    public function listManufacturers(ListManufacturersUseCase $useCase): JsonResponse
    {
        $manufacturers = $useCase();

        return response()->json(ManufacturerResource::collection($manufacturers));
    }

    public function listProducts(Request $request, ListProductsUseCase $useCase): JsonResponse
    {
        $products = $useCase($request->all());

        return response()->json(ProductResource::collection($products));
    }

    public function popularProducts(ListProductsUseCase $useCase): JsonResponse
    {
        $products = $useCase(['is_popular' => true]);

        return response()->json(ProductResource::collection($products));
    }

    public function showProduct(GetProductUseCase $useCase, string $id): JsonResponse
    {
        $product = $useCase($id);
        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json(new ProductResource($product));
    }
}
