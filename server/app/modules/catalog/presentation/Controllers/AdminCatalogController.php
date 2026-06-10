<?php

namespace App\Modules\Catalog\Presentation\Controllers;

use App\Modules\Catalog\Application\DTO\CreateProductDTO;
use App\Modules\Catalog\Application\DTO\UpdateProductDTO;
use App\Modules\Catalog\Application\DTO\UploadProductImageDTO;
use App\Modules\Catalog\Application\UseCases\CreateProductUseCase;
use App\Modules\Catalog\Application\UseCases\DeleteProductImageUseCase;
use App\Modules\Catalog\Application\UseCases\DeleteProductUseCase;
use App\Modules\Catalog\Application\UseCases\UpdateProductUseCase;
use App\Modules\Catalog\Application\UseCases\UploadProductImageUseCase;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\BrandModel;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\CategoryModel;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\ManufacturerModel;
use App\Modules\Catalog\Infrastructure\Persistence\Eloquent\SectionModel;
use App\Modules\Catalog\Presentation\Requests\CreateProductRequest;
use App\Modules\Catalog\Presentation\Requests\UpdateProductRequest;
use App\Modules\Catalog\Presentation\Requests\UploadProductImageRequest;
use App\Modules\Catalog\Presentation\Resources\ProductImageResource;
use App\Modules\Catalog\Presentation\Resources\ProductResource;
use App\Modules\Pharmacies\Infrastructure\Persistence\Eloquent\PharmacyModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminCatalogController extends Controller
{
    public function createProduct(CreateProductRequest $request, CreateProductUseCase $useCase): JsonResponse
    {
        $dto = new CreateProductDTO(
            name: $request->input('name'),
            slug: $request->input('slug'),
            description: $request->input('description'),
            price: $request->input('price'),
            oldPrice: $request->input('old_price'),
            isPopular: $request->input('is_popular', false),
            isPrescription: $request->input('is_prescription', false),
            info: $request->input('info'),
            categoryId: $request->input('category_id'),
            brandId: $request->input('brand_id'),
            manufacturerId: $request->input('manufacturer_id'),
            createdBy: $request->user()->id,
        );

        $product = $useCase($dto);

        return response()->json(new ProductResource($product), 201);
    }

    public function updateProduct(UpdateProductRequest $request, UpdateProductUseCase $useCase, string $id): JsonResponse
    {
        $dto = new UpdateProductDTO(
            id: $id,
            name: $request->input('name'),
            slug: $request->input('slug'),
            description: $request->input('description'),
            price: $request->input('price'),
            oldPrice: $request->input('old_price'),
            isPopular: $request->input('is_popular', false),
            isPrescription: $request->input('is_prescription', false),
            info: $request->input('info'),
            categoryId: $request->input('category_id'),
            brandId: $request->input('brand_id'),
            manufacturerId: $request->input('manufacturer_id'),
            updatedBy: $request->user()->id,
        );

        $product = $useCase($dto);

        return response()->json(new ProductResource($product));
    }

    public function deleteProduct(DeleteProductUseCase $useCase, string $id): JsonResponse
    {
        $useCase($id);

        return response()->json(null, 204);
    }

    public function uploadImage(UploadProductImageRequest $request, UploadProductImageUseCase $useCase, string $id): JsonResponse
    {
        $dto = new UploadProductImageDTO(
            productId: $id,
            image: $request->file('image'),
            altText: $request->input('alt_text'),
            sortOrder: $request->input('sort_order', 0),
            isMain: $request->input('is_main', false)
        );

        $productImage = $useCase($dto);

        return response()->json(new ProductImageResource($productImage), 201);
    }

    public function deleteImage(DeleteProductImageUseCase $useCase, string $id, string $imageId): JsonResponse
    {
        $useCase($imageId);

        return response()->json(null, 204);
    }

    public function createSection(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $section = SectionModel::create($data);

        return response()->json($this->sectionResponse($section), 201);
    }

    public function updateSection(Request $request, int $id): JsonResponse
    {
        $section = SectionModel::findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $section->update($data);

        return response()->json($this->sectionResponse($section));
    }

    public function deleteSection(int $id): JsonResponse
    {
        SectionModel::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    public function createCategory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'section_id' => ['required', 'integer', 'exists:sections,id'],
        ]);

        $category = CategoryModel::create($data);

        return response()->json($this->categoryResponse($category), 201);
    }

    public function updateCategory(Request $request, int $id): JsonResponse
    {
        $category = CategoryModel::findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'section_id' => ['required', 'integer', 'exists:sections,id'],
        ]);

        $category->update($data);

        return response()->json($this->categoryResponse($category));
    }

    public function deleteCategory(int $id): JsonResponse
    {
        CategoryModel::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    public function createBrand(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:brands,name'],
        ]);

        $brand = BrandModel::create($data);

        return response()->json($this->brandResponse($brand), 201);
    }

    public function updateBrand(Request $request, int $id): JsonResponse
    {
        $brand = BrandModel::findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:brands,name,'.$id],
        ]);

        $brand->update($data);

        return response()->json($this->brandResponse($brand));
    }

    public function deleteBrand(int $id): JsonResponse
    {
        BrandModel::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    public function createManufacturer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:manufacturers,name'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $manufacturer = ManufacturerModel::create($data);

        return response()->json($this->manufacturerResponse($manufacturer), 201);
    }

    public function updateManufacturer(Request $request, int $id): JsonResponse
    {
        $manufacturer = ManufacturerModel::findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:manufacturers,name,'.$id],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        $manufacturer->update($data);

        return response()->json($this->manufacturerResponse($manufacturer));
    }

    public function deleteManufacturer(int $id): JsonResponse
    {
        ManufacturerModel::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    public function createPharmacy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'working_hours' => ['nullable', 'string', 'max:255'],
        ]);

        $pharmacy = PharmacyModel::create($data);

        return response()->json($this->pharmacyResponse($pharmacy), 201);
    }

    public function updatePharmacy(Request $request, int $id): JsonResponse
    {
        $pharmacy = PharmacyModel::findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'working_hours' => ['nullable', 'string', 'max:255'],
        ]);

        $pharmacy->update($data);

        return response()->json($this->pharmacyResponse($pharmacy));
    }

    public function deletePharmacy(int $id): JsonResponse
    {
        PharmacyModel::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    private function sectionResponse(SectionModel $section): array
    {
        return [
            'id' => $section->id,
            'name' => $section->name,
            'description' => $section->description,
        ];
    }

    private function categoryResponse(CategoryModel $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'description' => $category->description,
            'section_id' => $category->section_id,
        ];
    }

    private function brandResponse(BrandModel $brand): array
    {
        return [
            'id' => $brand->id,
            'name' => $brand->name,
        ];
    }

    private function manufacturerResponse(ManufacturerModel $manufacturer): array
    {
        return [
            'id' => $manufacturer->id,
            'name' => $manufacturer->name,
            'country' => $manufacturer->country,
        ];
    }

    private function pharmacyResponse(PharmacyModel $pharmacy): array
    {
        return [
            'id' => $pharmacy->id,
            'name' => $pharmacy->name,
            'address' => $pharmacy->address,
            'working_hours' => $pharmacy->working_hours,
        ];
    }
}
