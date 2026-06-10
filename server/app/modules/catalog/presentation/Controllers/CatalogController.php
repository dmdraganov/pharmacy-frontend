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
use App\Support\ApiResponse;
use App\Support\PaginatesArrays;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CatalogController extends Controller
{
    use ApiResponse;
    use PaginatesArrays;

    public function __construct() {}

    public function listSections(Request $request, ListSectionsUseCase $useCase): JsonResponse
    {
        $sections = $useCase();
        $result = $this->paginateArray($sections, $request);

        return $this->ok(SectionResource::collection($result['data']), $result['meta']);
    }

    public function listCategories(Request $request, ListCategoriesUseCase $useCase): JsonResponse
    {
        $categories = $useCase();
        $result = $this->paginateArray($categories, $request);

        return $this->ok(CategoryResource::collection($result['data']), $result['meta']);
    }

    public function listBrands(Request $request, ListBrandsUseCase $useCase): JsonResponse
    {
        $brands = $useCase();
        $result = $this->paginateArray($brands, $request);

        return $this->ok(BrandResource::collection($result['data']), $result['meta']);
    }

    public function listManufacturers(Request $request, ListManufacturersUseCase $useCase): JsonResponse
    {
        $manufacturers = $useCase();
        $result = $this->paginateArray($manufacturers, $request);

        return $this->ok(ManufacturerResource::collection($result['data']), $result['meta']);
    }

    public function listProducts(Request $request, ListProductsUseCase $useCase): JsonResponse
    {
        $result = $useCase($request->all());

        return $this->ok(ProductResource::collection($result['data']), $result['meta']);
    }

    public function popularProducts(Request $request, ListProductsUseCase $useCase): JsonResponse
    {
        $result = $useCase([...$request->all(), 'is_popular' => true]);

        return $this->ok(ProductResource::collection($result['data']), $result['meta']);
    }

    public function showProduct(GetProductUseCase $useCase, string $id): JsonResponse
    {
        $product = $useCase($id);
        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return $this->ok(new ProductResource($product));
    }
}
